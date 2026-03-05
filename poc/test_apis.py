"""
PoC 1 — Prueba de conexión a APIs de datos (Open-Meteo + NewsAPI)
=================================================================

Demuestra:
  - Geocodificación con Open-Meteo Geocoding API (sin key)
  - Consulta meteorológica con Open-Meteo Forecast API (sin key)
  - Consulta de noticias con NewsAPI (requiere NEWSAPI_KEY en .env)

Ejecución:
  cd voyager-ai
  pip install httpx python-dotenv
  python poc/test_apis.py
"""

import asyncio
import os
import sys
import json

# Cargar .env si existe
try:
    from dotenv import load_dotenv
    load_dotenv(os.path.join(os.path.dirname(__file__), "..", ".env"))
except ImportError:
    pass

import httpx

DESTINO = "Tokio, Japón"
# Usamos fechas cercanas a hoy para que Open-Meteo tenga datos (máx. 16 días)
from datetime import date, timedelta
_hoy = date.today()
FECHA_INICIO = (_hoy + timedelta(days=2)).isoformat()
FECHA_FIN = (_hoy + timedelta(days=4)).isoformat()

GEOCODING_URL = "https://geocoding-api.open-meteo.com/v1/search"
WEATHER_URL = "https://api.open-meteo.com/v1/forecast"
NEWSAPI_URL = "https://newsapi.org/v2/everything"


async def test_geocoding():
    """Prueba 1a: Geocodificación del destino."""
    print("\n" + "=" * 60)
    print("🌍 PRUEBA 1a: Geocodificación (Open-Meteo)")
    print("=" * 60)

    async with httpx.AsyncClient(timeout=10) as client:
        resp = await client.get(GEOCODING_URL, params={
            "name": DESTINO,
            "count": 1,
            "language": "es",
            "format": "json",
        })

    print(f"  Status: {resp.status_code}")
    data = resp.json()
    results = data.get("results", [])

    if results:
        loc = results[0]
        print(f"  ✅ Destino: {loc.get('name')} ({loc.get('country')})")
        print(f"  ✅ Coordenadas: lat={loc['latitude']}, lon={loc['longitude']}")
        return loc["latitude"], loc["longitude"]
    else:
        print("  ❌ No se encontraron resultados.")
        return None, None


async def test_weather(lat: float, lon: float):
    """Prueba 1b: Datos meteorológicos."""
    print("\n" + "=" * 60)
    print("🌤️  PRUEBA 1b: Clima (Open-Meteo Forecast)")
    print("=" * 60)

    async with httpx.AsyncClient(timeout=10) as client:
        resp = await client.get(WEATHER_URL, params={
            "latitude": lat,
            "longitude": lon,
            "daily": "temperature_2m_max,temperature_2m_min,precipitation_sum,weathercode",
            "start_date": FECHA_INICIO,
            "end_date": FECHA_FIN,
            "timezone": "auto",
        })

    print(f"  Status: {resp.status_code}")
    data = resp.json()
    daily = data.get("daily", {})

    if daily:
        temps_max = daily.get("temperature_2m_max", [])
        temps_min = daily.get("temperature_2m_min", [])
        precip = daily.get("precipitation_sum", [])
        print(f"  ✅ Temp. máximas: {temps_max}")
        print(f"  ✅ Temp. mínimas: {temps_min}")
        print(f"  ✅ Precipitación (mm): {precip}")
    else:
        print("  ❌ No se obtuvieron datos diarios.")


async def test_newsapi():
    """Prueba 1c: Noticias del destino."""
    print("\n" + "=" * 60)
    print("📰 PRUEBA 1c: Noticias (NewsAPI)")
    print("=" * 60)

    api_key = os.getenv("NEWSAPI_KEY", "")
    if not api_key:
        print("  ⚠️  NEWSAPI_KEY no configurada en .env. Saltando prueba.")
        print("  ℹ️  Obtén tu key en https://newsapi.org/register")
        return

    async with httpx.AsyncClient(timeout=10) as client:
        resp = await client.get(NEWSAPI_URL, params={
            "q": DESTINO,
            "sortBy": "relevancy",
            "pageSize": 3,
            "language": "es",
        }, headers={"X-Api-Key": api_key})

    print(f"  Status: {resp.status_code}")
    data = resp.json()

    if resp.status_code == 200:
        articles = data.get("articles", [])
        print(f"  ✅ Artículos encontrados: {len(articles)}")
        for i, a in enumerate(articles[:3], 1):
            print(f"     {i}. {a.get('title', 'Sin título')}")
    else:
        print(f"  ❌ Error: {data.get('message', 'Desconocido')}")


async def main():
    print(f"\n{'#' * 60}")
    print(f"  Voyager AI — PoC 1: Prueba de APIs de datos")
    print(f"  Destino: {DESTINO}")
    print(f"  Fechas: {FECHA_INICIO} → {FECHA_FIN}")
    print(f"{'#' * 60}")

    lat, lon = await test_geocoding()

    if lat is not None and lon is not None:
        await test_weather(lat, lon)

    await test_newsapi()

    print(f"\n{'#' * 60}")
    print("  ✅ PoC 1 finalizada.")
    print(f"{'#' * 60}\n")


if __name__ == "__main__":
    asyncio.run(main())
