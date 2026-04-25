import httpx
from app.config import settings
from datetime import datetime, timedelta

NEWSAPI_URL = "https://newsapi.org/v2/everything"

# Palabras que EXCLUYEN una noticia (deportes, entretenimiento, finanzas, política...)
BLACKLIST = {
    # Deportes
    "fichaje", "liga", "gol", "champions", "futbol", "fútbol", "partido",
    "selección", "entrenador", "playoff", "baloncesto", "f1", "gran premio",
    "derbi", "derby", "scudetto", "serie a", "premier league", "laliga",
    "apuestas", "pronósticos", "pronosticos", "real madrid", "atlético",
    "juventus", "bundesliga", "ligue 1", "copa del rey", "uefa", "fifa",
    "mundial", "eliminatoria", "goleada", "penalti", "arbitro", "árbitro",
    "tarjeta roja", "banquillo", "delantero", "portero", "nba", "nfl",
    "tenis", "nadal", "djokovic", "motogp", "moto gp", "supercopa",
    "semifinal", "final four", "euroliga", "jornada", "clasificación",
    "temporada", "refuerzo", "traspaso", "canterano", "hatrick",
    # Entretenimiento
    "película", "pelicula", "serie", "netflix", "estreno", "taquilla",
    "actor", "actriz", "director", "biopic", "hollywood", "oscar",
    "grammy", "videojuego", "gaming", "steam", "playstation", "xbox",
    "anime", "manga", "concierto", "gira musical", "álbum", "album",
    # Política y economía
    "elecciones", "congreso", "senado", "parlamento", "gobierno",
    "bitcoin", "criptomoneda", "acciones", "bolsa", "inversión",
    "cotización", "wall street", "nasdaq", "inflación", "pib",
    # Sucesos
    "asesinato", "homicidio", "detenido", "arrestado", "crimen",
}

# Palabras que INCLUYEN una noticia (bonus de relevancia turística)
WHITELIST = {
    "turismo", "turista", "hotel", "hostal", "alojamiento",
    "vuelo", "aeropuerto", "aerolínea", "ryanair", "iberia",
    "museo", "exposición", "monumento", "catedral", "palacio",
    "restaurante", "gastronomía", "gastronomia", "michelin",
    "playa", "costa", "crucero", "ferry", "tren",
    "festival", "fiesta", "feria", "evento cultural",
    "patrimonio", "unesco", "visitar", "viaje", "viajar",
    "ruta", "senderismo", "excursión", "guía turística",
    "pasaporte", "visado", "aduana", "frontera",
}


def _score_article(title: str, description: str, destino: str) -> int:
    """
    Puntúa una noticia: positivo = relevante, negativo = irrelevante.
    Solo se muestran las que tengan puntuación > 0.
    """
    text = f"{title} {description}".lower()
    destino_lower = destino.lower()
    
    # El destino DEBE aparecer en el título
    if destino_lower not in title.lower():
        return -100
    
    score = 0
    
    # Penalizar si contiene palabras de la blacklist
    for word in BLACKLIST:
        if word in text:
            return -100  # Descartada inmediatamente
    
    # Bonus por palabras de turismo
    for word in WHITELIST:
        if word in text:
            score += 2
    
    # Si no tiene ni bonus ni penalización, darle un punto base
    # (al menos menciona el destino en el título y no está en blacklist)
    if score == 0:
        score = 1
    
    return score


async def get_recent_news(destino: str) -> list:
    """Devuelve noticias relevantes para turistas con titulo, url y contexto."""
    if not settings.NEWSAPI_KEY:
        return []
        
    async with httpx.AsyncClient(timeout=10) as client:
        try:
            from_date = (datetime.now() - timedelta(days=30)).strftime("%Y-%m-%d")
            resp = await client.get(NEWSAPI_URL, params={
                "q": destino,
                "searchIn": "title",
                "from": from_date,
                "sortBy": "relevancy",
                "pageSize": 20,
                "language": "es",
            }, headers={"X-Api-Key": settings.NEWSAPI_KEY})
            
            if resp.status_code != 200:
                return []
                
            data = resp.json()
            articles = data.get("articles", [])
            
            # Puntuar y ordenar por relevancia turística
            scored = []
            for a in articles:
                title = a.get("title", "")
                desc = a.get("description", "")
                url = a.get("url", "")
                
                if not title or not url:
                    continue
                    
                score = _score_article(title, desc, destino)
                if score > 0:
                    scored.append({
                        "titulo": title,
                        "url": url,
                        "contexto": f"{title} — {desc}" if desc else title,
                        "score": score,
                    })
            
            # Ordenar por puntuación (las más turísticas primero) y devolver top 3
            scored.sort(key=lambda x: x["score"], reverse=True)
            return [{"titulo": s["titulo"], "url": s["url"], "contexto": s["contexto"]} for s in scored[:3]]
            
        except Exception:
            return []
