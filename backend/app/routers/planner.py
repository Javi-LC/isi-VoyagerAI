from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
import asyncio
import json
from app.models import TravelRequest, TravelResponse
from app.services.geocoding import get_coordinates
from app.services.weather import get_weather
from app.services.news import get_recent_news
from app.services.gemini import generate_itinerary
from app.database import get_db
from app.db_models import TripRecord

router = APIRouter()

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
async def create_plan(request: TravelRequest, db: Session = Depends(get_db)):
    # 1. Geocodificación
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
    try:
        itinerario = await generate_itinerary(request, clima, noticias)
        
        # 4. Guardar en la base de datos
        db_trip = TripRecord(
            destino=request.destino,
            fecha_inicio=str(request.fechas.inicio),
            fecha_fin=str(request.fechas.fin),
            itinerario_json=itinerario.model_dump_json()
        )
        db.add(db_trip)
        db.commit()
        
        return itinerario
    except Exception as e:
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
