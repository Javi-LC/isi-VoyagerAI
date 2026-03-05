"""Voyager AI — Servicio de noticias (NewsAPI)."""

import httpx
from app.config import get_settings


async def get_news(query: str, max_articles: int = 5) -> list[dict]:
    """Busca noticias relevantes sobre el destino.

    Devuelve una lista de dicts con {title, description, url}.
    Si la API key no está configurada, devuelve lista vacía.
    """
    settings = get_settings()

    if not settings.newsapi_key:
        return []

    url = f"{settings.newsapi_base}/everything"
    params = {
        "q": query,
        "sortBy": "relevancy",
        "pageSize": max_articles,
        "language": "es",
    }
    headers = {"X-Api-Key": settings.newsapi_key}

    try:
        async with httpx.AsyncClient(timeout=10) as client:
            resp = await client.get(url, params=params, headers=headers)
            resp.raise_for_status()
            data = resp.json()

        articles = data.get("articles", [])
        return [
            {
                "title": a.get("title", ""),
                "description": a.get("description", ""),
                "url": a.get("url", ""),
            }
            for a in articles
            if a.get("title")
        ]
    except Exception:
        # Si falla NewsAPI, no bloqueamos el flujo principal
        return []
