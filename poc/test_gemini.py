"""
PoC 2 — Prueba de ingeniería de prompts con Gemini 2.0 Flash
=============================================================

Demuestra:
  - Conexión al API de Google Gemini
  - Envío de prompt con contexto meteorológico y forzado de JSON
  - Validación de que la respuesta es JSON estructurado válido

Requisitos:
  - GEMINI_API_KEY en el archivo .env (obtener en https://aistudio.google.com/apikey)

Ejecución:
  cd voyager-ai
  pip install google-genai python-dotenv
  python poc/test_gemini.py
"""

import os
import sys
import json

# Cargar .env
try:
    from dotenv import load_dotenv
    load_dotenv(os.path.join(os.path.dirname(__file__), "..", ".env"))
except ImportError:
    pass

from google import genai


def main():
    print(f"\n{'#' * 60}")
    print(f"  Voyager AI — PoC 2: Prueba de Gemini 2.0 Flash")
    print(f"{'#' * 60}")

    api_key = os.getenv("GEMINI_API_KEY", "")
    if not api_key:
        print("\n  ❌ GEMINI_API_KEY no configurada en .env")
        print("  ℹ️  Obtén tu key en https://aistudio.google.com/apikey")
        sys.exit(1)

    client = genai.Client(api_key=api_key)

    # Prompt de prueba simplificado
    prompt = """Eres un planificador de viajes experto. Genera un mini-itinerario de 1 día para visitar Roma, Italia.

CONTEXTO: Temperaturas de 15-20°C, soleado. El usuario está interesado en historia y gastronomía.

Tu respuesta DEBE ser EXCLUSIVAMENTE un objeto JSON con esta estructura:
{
  "resumen": {
    "destino": "Roma, Italia",
    "fecha_inicio": "2026-03-25",
    "fecha_fin": "2026-03-25",
    "clima_general": "string"
  },
  "itinerario": [
    {
      "dia": "Día 1 — 25 de Marzo",
      "actividades": [
        {
          "hora": "HH:MM",
          "lugar": "string",
          "tipo_icono": "string (nombre de icono Lucide)",
          "descripcion": "string",
          "consejo_ia": "string",
          "coste_estimado": "string"
        }
      ]
    }
  ],
  "consejos_generales": [
    {"icono": "string", "categoria": "string", "mensaje": "string"}
  ]
}

Genera al menos 3 actividades. RESPONDE ÚNICAMENTE CON EL JSON:"""

    print("\n  📤 Enviando prompt a Gemini 2.5 Flash Lite...")
    print(f"  Modelo: gemini-2.5-flash-lite")

    try:
        response = client.models.generate_content(
            model="gemini-2.5-flash-lite",
            contents=prompt,
            config=genai.types.GenerateContentConfig(
                temperature=0.7,
                response_mime_type="application/json",
                thinking_config=genai.types.ThinkingConfig(thinking_budget=0),
            ),
        )
    except Exception as e:
        print(f"\n  ❌ Error al llamar a Gemini: {e}")
        sys.exit(1)

    raw = response.text.strip()

    # Limpiar posibles bloques de código
    if raw.startswith("```"):
        lines = raw.split("\n")
        lines = [l for l in lines if not l.strip().startswith("```")]
        raw = "\n".join(lines)

    print(f"\n  📥 Respuesta recibida ({len(raw)} caracteres)")

    # Validar JSON
    try:
        parsed = json.loads(raw)
        print("  ✅ La respuesta ES JSON válido.\n")
    except json.JSONDecodeError as e:
        print(f"  ❌ La respuesta NO es JSON válido: {e}")
        print(f"  Respuesta cruda:\n{raw[:500]}")
        sys.exit(1)

    # Verificar campos esperados
    expected_keys = ["resumen", "itinerario"]
    for key in expected_keys:
        if key in parsed:
            print(f"  ✅ Campo '{key}' presente.")
        else:
            print(f"  ⚠️  Campo '{key}' AUSENTE.")

    # Verificar actividades
    itinerario = parsed.get("itinerario", [])
    if itinerario:
        actividades = itinerario[0].get("actividades", [])
        print(f"  ✅ Actividades generadas: {len(actividades)}")
        for act in actividades[:3]:
            print(f"     → {act.get('hora', '??:??')} | {act.get('lugar', '?')} [{act.get('tipo_icono', '?')}]")

    # Mostrar JSON formateado
    print(f"\n  {'─' * 50}")
    print("  JSON completo:\n")
    print(json.dumps(parsed, indent=2, ensure_ascii=False))

    print(f"\n{'#' * 60}")
    print("  ✅ PoC 2 finalizada correctamente.")
    print(f"{'#' * 60}\n")


if __name__ == "__main__":
    main()
