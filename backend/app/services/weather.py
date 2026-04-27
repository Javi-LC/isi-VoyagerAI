import httpx
from datetime import date

WEATHER_URL = "https://api.open-meteo.com/v1/forecast"

async def get_weather(lat: float, lon: float, start_date: date, end_date: date) -> str:
    async with httpx.AsyncClient(timeout=10) as client:
        try:
            # Open-Meteo no soporta start_date/end_date en /forecast
            # Usamos solo los parámetros básicos
            resp = await client.get(WEATHER_URL, params={
                "latitude": lat,
                "longitude": lon,
                "daily": "temperature_2m_max,temperature_2m_min,precipitation_sum,weathercode",
                "timezone": "auto",
            })
            resp.raise_for_status()
            data = resp.json()
            daily = data.get("daily", {})
            
            if daily:
                temps_max = daily.get("temperature_2m_max", [])
                temps_min = daily.get("temperature_2m_min", [])
                
                max_temp = max(temps_max) if temps_max else "N/A"
                min_temp = min(temps_min) if temps_min else "N/A"
                
                return f"Temperaturas estimadas entre {min_temp}°C y {max_temp}°C."
            return "No se pudieron obtener datos diarios del clima."
        except Exception as e:
            return f"Error obteniendo clima: {str(e)}"
