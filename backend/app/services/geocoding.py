"""Voyager AI — Servicio de geocodificación (Open-Meteo Geocoding API)."""

import httpx
from app.config import get_settings


async def geocode(destino: str) -> dict:
    """Devuelve {name, lat, lon, country} para el destino dado.

    Utiliza la API de geocodificación gratuita de Open-Meteo.
    """
    settings = get_settings()
    url = f"{settings.geocoding_base}/search"
    params = {"name": destino, "count": 1, "language": "es", "format": "json"}

    async with httpx.AsyncClient(timeout=10) as client:
        resp = await client.get(url, params=params)
        resp.raise_for_status()
        data = resp.json()

    results = data.get("results", [])
    if not results:
        raise ValueError(f"No se encontraron coordenadas para '{destino}'.")

    loc = results[0]
    return {
        "name": loc.get("name", destino),
        "lat": loc["latitude"],
        "lon": loc["longitude"],
        "country": loc.get("country", ""),
    }
