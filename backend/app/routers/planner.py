"""Voyager AI — Router principal de planificación."""

import asyncio
from fastapi import APIRouter, HTTPException
from app.models import TravelRequest, TravelResponse, HealthResponse
from app.config import get_settings
from app.services.geocoding import geocode
from app.services.weather import get_weather
from app.services.news import get_news
from app.services.gemini import generate_itinerary
import httpx

router = APIRouter(prefix="/api", tags=["planner"])


@router.post("/plan", response_model=TravelResponse)
async def plan_trip(req: TravelRequest):
    """Endpoint principal: recibe datos de viaje y devuelve itinerario IA."""
    try:
        # 1. Geocodificar destino
        location = await geocode(req.destino)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"Error en geocodificación: {e}")

    # 2. Llamadas concurrentes a clima y noticias
    try:
        weather_task = get_weather(
            lat=location["lat"],
            lon=location["lon"],
            start=req.fechas.inicio,
            end=req.fechas.fin,
        )
        news_task = get_news(query=req.destino)
        weather_data, news_data = await asyncio.gather(weather_task, news_task)
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"Error consultando APIs externas: {e}")

    # 3. Generar itinerario con Gemini
    try:
        result = await generate_itinerary(
            destino=req.destino,
            fecha_inicio=req.fechas.inicio.isoformat(),
            fecha_fin=req.fechas.fin.isoformat(),
            intereses=req.intereses,
            presupuesto=req.presupuesto,
            restricciones=req.restricciones,
            weather_data=weather_data,
            news_data=news_data,
        )
    except ValueError as e:
        raise HTTPException(status_code=500, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"Error con Gemini: {e}")

    # 4. Validar y devolver
    try:
        response = TravelResponse(**result)
    except Exception:
        # Si Gemini devuelve campos extra o faltantes, intentar igualmente
        return result

    return response


@router.get("/health", response_model=HealthResponse)
async def health_check():
    """Comprueba el estado del backend y la conectividad con las APIs."""
    settings = get_settings()
    apis = {}

    async with httpx.AsyncClient(timeout=5) as client:
        # Open-Meteo
        try:
            r = await client.get(f"{settings.open_meteo_base}/forecast?latitude=0&longitude=0&daily=temperature_2m_max&forecast_days=1")
            apis["open_meteo"] = "reachable" if r.status_code == 200 else f"error ({r.status_code})"
        except Exception:
            apis["open_meteo"] = "unreachable"

        # NewsAPI
        if settings.newsapi_key:
            try:
                r = await client.get(
                    f"{settings.newsapi_base}/everything",
                    params={"q": "test", "pageSize": 1},
                    headers={"X-Api-Key": settings.newsapi_key},
                )
                apis["newsapi"] = "reachable" if r.status_code == 200 else f"error ({r.status_code})"
            except Exception:
                apis["newsapi"] = "unreachable"
        else:
            apis["newsapi"] = "no_key_configured"

        # Gemini
        if settings.gemini_api_key:
            apis["gemini"] = "key_configured"
        else:
            apis["gemini"] = "no_key_configured"

    return HealthResponse(
        status="ok",
        version=settings.app_version,
        apis=apis,
    )
