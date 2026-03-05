"""Voyager AI — Servicio de clima (Open-Meteo Forecast API)."""

import httpx
from datetime import date
from app.config import get_settings


async def get_weather(lat: float, lon: float, start: date, end: date) -> dict:
    """Obtiene previsión meteorológica para las coordenadas y rango de fechas.

    Devuelve un dict con claves:
      - temperature_max / temperature_min (listas diarias)
      - precipitation_sum (lista diaria)
      - weathercode (lista diaria)
      - resumen: string legible con el clima general
    """
    settings = get_settings()
    url = f"{settings.open_meteo_base}/forecast"
    params = {
        "latitude": lat,
        "longitude": lon,
        "daily": "temperature_2m_max,temperature_2m_min,precipitation_sum,weathercode",
        "start_date": start.isoformat(),
        "end_date": end.isoformat(),
        "timezone": "auto",
    }

    async with httpx.AsyncClient(timeout=10) as client:
        resp = await client.get(url, params=params)
        resp.raise_for_status()
        data = resp.json()

    daily = data.get("daily", {})
    temps_max = daily.get("temperature_2m_max", [])
    temps_min = daily.get("temperature_2m_min", [])
    precip = daily.get("precipitation_sum", [])
    codes = daily.get("weathercode", [])

    # Resumen legible
    if temps_max and temps_min:
        t_min = min(temps_min)
        t_max = max(temps_max)
        total_precip = sum(p for p in precip if p is not None)
        rain_note = f" Se esperan {total_precip:.1f} mm de precipitación acumulada." if total_precip > 0 else " Sin precipitaciones previstas."
        resumen = f"Temperaturas entre {t_min:.0f}°C y {t_max:.0f}°C.{rain_note}"
    else:
        resumen = "Datos climáticos no disponibles para el rango solicitado."

    return {
        "temperature_max": temps_max,
        "temperature_min": temps_min,
        "precipitation_sum": precip,
        "weathercode": codes,
        "resumen": resumen,
    }
