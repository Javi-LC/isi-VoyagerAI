from google import genai
import json
import asyncio
from app.config import settings
from app.models import TravelRequest, TravelResponse

async def generate_itinerary(
    request: TravelRequest, 
    clima: str, 
    noticias: list[str]
) -> TravelResponse:
    
    prompt = f"""Eres un planificador de viajes experto. Genera un itinerario estructurado para visitar {request.destino}.

CONFIURACIÓN DEL VIAJE:
- Fechas: Desde el {request.fechas.inicio} hasta el {request.fechas.fin}.
- Intereses: {', '.join(request.intereses)}
- Presupuesto: {request.presupuesto}
- Restricciones: {', '.join(request.restricciones) if request.restricciones else 'Ninguna'}

CONTEXTO ACTUAL:
- Clima esperado: {clima}
- Noticias recientes: {'; '.join(noticias)}

Tu respuesta DEBE ser EXCLUSIVAMENTE un objeto JSON válido que respete ESTRICTAMENTE esta estructura:
{{
  "resumen": {{
    "destino": "{request.destino}",
    "fecha_inicio": "{request.fechas.inicio}",
    "fecha_fin": "{request.fechas.fin}",
    "clima_general": "{clima}",
    "noticias_relevantes": {json.dumps(noticias, ensure_ascii=False)}
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
        return TravelResponse(**parsed)
    except Exception as e:
        raise ValueError(f"Error generando itinerario con Gemini: {str(e)}")
