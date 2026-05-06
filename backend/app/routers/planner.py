from fastapi import APIRouter, HTTPException, Depends, Header
from sqlalchemy.orm import Session
import asyncio
import json
import time
from typing import Dict, Tuple
from app.models import TravelRequest, TravelResponse
from app.services.geocoding import get_coordinates, get_place_coordinates
from app.services.weather import get_weather
from app.services.news import get_recent_news
from app.services.gemini import generate_itinerary
from app.database import get_db
from app.db_models import TripRecord

router = APIRouter()
IDEMPOTENCY_TTL_SECONDS = 10 * 60
IDEMPOTENCY_CACHE: Dict[str, Tuple[float, TravelResponse]] = {}
IDEMPOTENCY_LOCKS: Dict[str, asyncio.Lock] = {}


def _cleanup_idempotency_cache(now_ts: float) -> None:
    expired_keys = [
        key
        for key, (created_at, _) in IDEMPOTENCY_CACHE.items()
        if now_ts - created_at > IDEMPOTENCY_TTL_SECONDS
    ]
    for key in expired_keys:
        IDEMPOTENCY_CACHE.pop(key, None)
        IDEMPOTENCY_LOCKS.pop(key, None)


async def _build_itinerary(request: TravelRequest) -> TravelResponse:
    # 1. Geocodificacion
    lat, lon = await get_coordinates(request.destino)

    clima = "No disponible"
    if lat is not None and lon is not None:
        # 2. Consultar clima y noticias en paralelo
        clima_task = get_weather(lat, lon, request.fechas.inicio, request.fechas.fin)
        noticias_task = get_recent_news(request.destino)

        clima, noticias = await asyncio.gather(clima_task, noticias_task)
    else:
        # Fallback si no hay coordenadas
        noticias = await get_recent_news(request.destino)
        clima = f"No se pudo encontrar las coordenadas para {request.destino}."

    # 3. Generar itinerario con Gemini
    itinerario = await generate_itinerary(request, clima, noticias)
    
    # 4. Enriquecer las actividades con coordenadas
    ciudad_destino = request.destino.split(",")[0].strip()
    
    async def enrich_activity(act):
        lat, lng = await get_place_coordinates(act.lugar, city=ciudad_destino)
        # Fallback a coordenadas de la ciudad si no se encuentra
        act.lat = lat if lat is not None else get_lat
        act.lng = lng if lng is not None else get_lng
        
    get_lat = lat
    get_lng = lon

    enrich_tasks = []
    for dia in itinerario.itinerario:
        for act in dia.actividades:
            enrich_tasks.append(enrich_activity(act))
            
    if enrich_tasks:
        await asyncio.gather(*enrich_tasks)
        
    return itinerario


def _save_trip(db: Session, request: TravelRequest, itinerario: TravelResponse) -> None:
    db_trip = TripRecord(
        destino=request.destino,
        fecha_inicio=str(request.fechas.inicio),
        fecha_fin=str(request.fechas.fin),
        itinerario_json=itinerario.model_dump_json(),
    )
    db.add(db_trip)
    db.commit()

@router.get("/health")
async def health_check():
    return {
        "status": "ok",
        "version": "2.0.0",
        "apis": {
            "open_meteo": "reachable",
            "newsapi": "reachable",
            "gemini": "reachable"
        }
    }

@router.post("/plan", response_model=TravelResponse)
async def create_plan(
    request: TravelRequest,
    db: Session = Depends(get_db),
    x_idempotency_key: str | None = Header(default=None, alias="X-Idempotency-Key"),
):
    try:
        if not x_idempotency_key:
            itinerario = await _build_itinerary(request)
            _save_trip(db, request, itinerario)
            return itinerario

        now_ts = time.time()
        _cleanup_idempotency_cache(now_ts)

        cached = IDEMPOTENCY_CACHE.get(x_idempotency_key)
        if cached:
            _, cached_itinerary = cached
            return cached_itinerary

        request_lock = IDEMPOTENCY_LOCKS.setdefault(x_idempotency_key, asyncio.Lock())
        async with request_lock:
            cached = IDEMPOTENCY_CACHE.get(x_idempotency_key)
            if cached:
                _, cached_itinerary = cached
                return cached_itinerary

            itinerario = await _build_itinerary(request)
            _save_trip(db, request, itinerario)
            IDEMPOTENCY_CACHE[x_idempotency_key] = (time.time(), itinerario)
            return itinerario
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/trips")
def get_trips(skip: int = 0, limit: int = 10, db: Session = Depends(get_db)):
    trips = db.query(TripRecord).order_by(TripRecord.fecha_creacion.desc()).offset(skip).limit(limit).all()
    return [{"id": t.id, "destino": t.destino, "fecha_inicio": t.fecha_inicio, "fecha_fin": t.fecha_fin, "fecha_creacion": t.fecha_creacion} for t in trips]

@router.get("/trips/{trip_id}")
def get_trip(trip_id: int, db: Session = Depends(get_db)):
    trip = db.query(TripRecord).filter(TripRecord.id == trip_id).first()
    if not trip:
        raise HTTPException(status_code=404, detail="Viaje no encontrado")
    return json.loads(trip.itinerario_json)
