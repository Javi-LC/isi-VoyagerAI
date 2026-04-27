import httpx
from typing import Tuple, Optional

GEOCODING_URL = "https://geocoding-api.open-meteo.com/v1/search"

async def get_coordinates(destino: str) -> Tuple[Optional[float], Optional[float]]:
    # La API de Open-Meteo solo acepta nombre de ciudad, no "Ciudad, País"
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
