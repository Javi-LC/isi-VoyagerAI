from google import genai
import json
import asyncio
from app.config import settings
from app.models import TravelRequest, TravelResponse

async def generate_itinerary(
    request: TravelRequest, 
    clima: str, 
    noticias: list
) -> TravelResponse:
    
    # Separar noticias reales (con URL) de las que son strings
    noticias_con_url = []
    noticias_texto = []
    for n in noticias:
        if isinstance(n, dict):
            noticias_con_url.append({"titulo": n.get("titulo", ""), "url": n.get("url", "")})
            noticias_texto.append(n.get("contexto", n.get("titulo", "")))
        else:
            noticias_texto.append(n)
    
    prompt = f"""Eres un planificador de viajes experto. Genera un itinerario estructurado para un viaje desde {request.origen} hacia {request.destino}.

CONFIGURACIÓN DEL VIAJE:
- Origen: {request.origen}
- Destino: {request.destino}
- Fechas: Desde el {request.fechas.inicio} hasta el {request.fechas.fin}.
- Intereses: {', '.join(request.intereses)}
- Presupuesto: {request.presupuesto}
- Restricciones: {', '.join(request.restricciones) if request.restricciones else 'Ninguna'}

CONTEXTO ACTUAL:
- Clima esperado: {clima}
- Noticias recientes del destino (como referencia): {'; '.join(noticias_texto) if noticias_texto else 'No hay noticias disponibles.'}

INSTRUCCIÓN SOBRE TIPS:
Genera SIEMPRE 2 o 3 datos breves y útiles que un turista debería saber antes de visitar {request.destino}.
Por ejemplo: requisitos de entrada, moneda local, costumbres, transporte público, eventos típicos de la época, etc.

Tu respuesta DEBE ser EXCLUSIVAMENTE un objeto JSON válido que respete ESTRICTAMENTE esta estructura:
{{
  "resumen": {{
    "origen": "{request.origen}",
    "destino": "{request.destino}",
    "fecha_inicio": "{request.fechas.inicio}",
    "fecha_fin": "{request.fechas.fin}",
    "clima_general": "Ver datos del clima",
    "tips_destino": ["Dato útil 1", "Dato útil 2", "Dato útil 3"]
  }},
  "advertencias": [
    {{
      "tipo": "clima o transporte",
      "icono": "alert-triangle",
      "severidad": "alta o media o baja",
      "mensaje": "Descripción de la advertencia si hay alguna."
    }}
  ],
  "itinerario": [
    {{
      "dia": "Día 1 — DD de Mes",
      "actividades": [
        {{
          "hora": "HH:MM",
          "lugar": "Nombre del lugar",
          "tipo_icono": "cpu", 
          "descripcion": "Descripción de la actividad",
          "consejo_ia": "Consejo útil",
          "coste_estimado": "Valor en €"
        }}
      ]
    }}
  ],
  "consejos_generales": [
    {{
      "icono": "wind",
      "categoria": "Categoría",
      "mensaje": "Consejo general"
    }}
  ],
  "presupuesto_estimado": {{
    "transporte": "Valor en €",
    "alimentacion": "Valor en €",
    "entradas": "Valor en €",
    "total": "Valor en €"
  }}
}}

Asegúrate de que haya actividades para CADA DÍA entre la fecha de inicio y de fin.
Usa nombres de iconos de Lucide-React como: utentils, map-pin, sun, camera, coffee, bus, tree-pine.
NO INCLUYAS texto fuera del JSON (ni siquiera etiquetas markdown ```json). RESPONDE ÚNICAMENTE CON EL JSON."""

    try:
        client = genai.Client(api_key=settings.GEMINI_API_KEY)
        
        response = await client.aio.models.generate_content(
            model=settings.GEMINI_MODEL,
            contents=prompt,
            config=genai.types.GenerateContentConfig(
                temperature=0.7,
                response_mime_type="application/json",
            )
        )
        
        raw = response.text.strip()
        if raw.startswith("```"):
            lines = raw.split("\n")
            lines = [l for l in lines if not l.strip().startswith("```")]
            raw = "\n".join(lines)
            
        parsed = json.loads(raw)
        
        # Solo noticias reales con URL (pre-filtradas por news.py)
        noticias_finales = []
        for noticia in noticias_con_url:
            if noticia.get("titulo"):
                noticias_finales.append(noticia)
        
        parsed["resumen"]["noticias_relevantes"] = noticias_finales
        # Forzar el clima real
        parsed["resumen"]["clima_general"] = clima
        # Limpiar campo temporal
        parsed["resumen"].pop("tips_destino", None)
        
        return TravelResponse(**parsed)
    except Exception as e:
        raise ValueError(f"Error generando itinerario con Gemini: {str(e)}")
