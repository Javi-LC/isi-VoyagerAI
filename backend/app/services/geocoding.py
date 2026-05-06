import httpx
import asyncio
from typing import Tuple, Optional

GEOCODING_URL = "https://geocoding-api.open-meteo.com/v1/search"
NOMINATIM_URL = "https://nominatim.openstreetmap.org/search"

async def get_coordinates(destino: str) -> Tuple[Optional[float], Optional[float]]:
    city_name = destino.split(",")[0].strip()
    
    async with httpx.AsyncClient(timeout=10) as client:
        try:
            resp = await client.get(GEOCODING_URL, params={
                "name": city_name,
                "count": 1,
                "language": "es",
                "format": "json",
            })
            resp.raise_for_status()
            data = resp.json()
            results = data.get("results", [])
            
            if results:
                loc = results[0]
                return loc["latitude"], loc["longitude"]
            return None, None
        except Exception:
            return None, None

async def get_place_coordinates(place: str, city: str = "") -> Tuple[Optional[float], Optional[float]]:
    query = f"{place}, {city}" if city else place
    headers = {"User-Agent": "VoyagerAI/2.0 (contact@voyagerai.test)"}
    
    async with httpx.AsyncClient(timeout=10, headers=headers) as client:
        try:
            resp = await client.get(NOMINATIM_URL, params={
                "q": query,
                "format": "json",
                "limit": 1
            })
            resp.raise_for_status()
            data = resp.json()
            if data and len(data) > 0:
                return float(data[0]["lat"]), float(data[0]["lon"])
            
            if city:
                await asyncio.sleep(1)
                resp = await client.get(NOMINATIM_URL, params={
                    "q": place,
                    "format": "json",
                    "limit": 1
                })
                resp.raise_for_status()
                data = resp.json()
                if data and len(data) > 0:
                    return float(data[0]["lat"]), float(data[0]["lon"])

            return None, None
        except Exception as e:
            return None, None

