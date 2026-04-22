import httpx
from app.config import settings

NEWSAPI_URL = "https://newsapi.org/v2/everything"

async def get_recent_news(destino: str) -> list[str]:
    if not settings.NEWSAPI_KEY:
        return ["La clave NEWSAPI_KEY no está configurada, no hay noticias disponibles."]
        
    async with httpx.AsyncClient(timeout=10) as client:
        try:
            resp = await client.get(NEWSAPI_URL, params={
                "q": destino,
                "sortBy": "relevancy",
                "pageSize": 3,
                "language": "es",
            }, headers={"X-Api-Key": settings.NEWSAPI_KEY})
            
            if resp.status_code != 200:
                return ["No se pudieron recuperar las noticias recientes por un error en la API."]
                
            data = resp.json()
            articles = data.get("articles", [])
            
            return [a.get("title", "Noticia sin título") for a in articles[:3]]
        except Exception:
            return ["Error de red intentando obtener noticias."]
