"""Voyager AI — Servicio de IA (Google Gemini 2.0 Flash)."""

import json
from google import genai
from app.config import get_settings


def _build_prompt(
    destino: str,
    fecha_inicio: str,
    fecha_fin: str,
    intereses: list[str],
    presupuesto: str,
    restricciones: list[str],
    weather_data: dict,
    news_data: list[dict],
) -> str:
    """Construye el prompt maestro con todo el contexto recopilado."""

    news_block = ""
    if news_data:
        news_items = "\n".join(f"  - {a['title']}: {a.get('description', '')}" for a in news_data[:5])
        news_block = f"\nNoticias recientes sobre {destino}:\n{news_items}\n"

    weather_block = weather_data.get("resumen", "No disponible")

    return f"""Eres un experto planificador de viajes. Genera un itinerario detallado para el siguiente viaje.

DESTINO: {destino}
FECHAS: {fecha_inicio} a {fecha_fin}
INTERESES: {', '.join(intereses) if intereses else 'General'}
PRESUPUESTO: {presupuesto}
RESTRICCIONES: {', '.join(restricciones) if restricciones else 'Ninguna'}

CONTEXTO METEOROLÓGICO:
{weather_block}

{news_block}

INSTRUCCIONES CRÍTICAS:
1. Tu respuesta DEBE ser EXCLUSIVAMENTE un objeto JSON válido. No incluyas texto antes ni después del JSON. No uses markdown, ni bloques de código, ni explicaciones fuera del JSON.
2. El JSON debe seguir EXACTAMENTE esta estructura:

{{
  "resumen": {{
    "destino": "string",
    "fecha_inicio": "YYYY-MM-DD",
    "fecha_fin": "YYYY-MM-DD",
    "clima_general": "string con resumen del clima",
    "noticias_relevantes": ["string con noticias relevantes para el viajero"]
  }},
  "advertencias": [
    {{
      "tipo": "transporte|clima|seguridad|salud",
      "icono": "nombre-icono-lucide",
      "severidad": "baja|media|alta",
      "mensaje": "string"
    }}
  ],
  "itinerario": [
    {{
      "dia": "Día N — fecha legible",
      "actividades": [
        {{
          "hora": "HH:MM",
          "lugar": "nombre del lugar",
          "tipo_icono": "nombre-icono-lucide válido (ej: landmark, utensils, camera, map-pin, coffee, shopping-bag, music, palette, book, tree-pine, waves, train, bus, plane, ship, bed, sun, cloud-rain, umbrella, thermometer, wind, compass, globe, heart, star, cpu, building, church, castle, museum, theater)",
          "descripcion": "descripción breve del lugar/actividad",
          "consejo_ia": "consejo personalizado basado en el contexto",
          "coste_estimado": "precio aproximado en EUR"
        }}
      ]
    }}
  ],
  "consejos_generales": [
    {{
      "icono": "nombre-icono-lucide",
      "categoria": "clima|transporte|presupuesto|cultura|seguridad|gastronomía",
      "mensaje": "string"
    }}
  ],
  "presupuesto_estimado": {{
    "transporte": "string con coste",
    "alimentacion": "string con coste",
    "entradas": "string con coste",
    "total": "string con coste total estimado"
  }}
}}

3. Genera al menos 3-5 actividades por día con horarios realistas.
4. Usa los datos meteorológicos proporcionados para generar advertencias si hay mal tiempo.
5. Integra las noticias relevantes en advertencias si afectan al viaje.
6. Todos los iconos DEBEN ser nombres válidos de la librería Lucide.
7. Los costes deben ser realistas para el destino y presupuesto indicados.
8. Adapta las actividades a los intereses y restricciones del usuario.

RESPONDE ÚNICAMENTE CON EL JSON:"""


async def generate_itinerary(
    destino: str,
    fecha_inicio: str,
    fecha_fin: str,
    intereses: list[str],
    presupuesto: str,
    restricciones: list[str],
    weather_data: dict,
    news_data: list[dict],
) -> dict:
    """Envía el prompt a Gemini y devuelve el JSON parseado."""
    settings = get_settings()

    if not settings.gemini_api_key:
        raise ValueError("GEMINI_API_KEY no está configurada. Revisa el archivo .env.")

    prompt = _build_prompt(
        destino, fecha_inicio, fecha_fin, intereses,
        presupuesto, restricciones, weather_data, news_data,
    )

    client = genai.Client(api_key=settings.gemini_api_key)
    response = client.models.generate_content(
        model=settings.gemini_model,
        contents=prompt,
        config=genai.types.GenerateContentConfig(
            temperature=0.7,
            response_mime_type="application/json",
        ),
    )

    raw_text = response.text.strip()

    # Limpiar posibles bloques de código markdown
    if raw_text.startswith("```"):
        lines = raw_text.split("\n")
        # Eliminar primera y última línea (```json y ```)
        lines = [l for l in lines if not l.strip().startswith("```")]
        raw_text = "\n".join(lines)

    try:
        result = json.loads(raw_text)
    except json.JSONDecodeError as e:
        raise ValueError(f"Gemini no devolvió JSON válido: {e}\nRespuesta: {raw_text[:500]}")

    return result
