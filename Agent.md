# Agent.md — Voyager AI: Sistema Inteligente de Planificación de Viajes

> **Proyecto:** Voyager AI  
> **Equipo:** Javier López Cabrera (Backend) · Adrián Alameda Alcaide (Frontend/Testing) · Rubén Calzado Chacón (Frontend/Testing)  
> **Sprint:** 2 — Arquitectura, Prototipos y Validación Tecnológica  
> **Fecha:** Marzo 2026  
> **Versión:** 1.0

---

## 1. Descripción del Proyecto

**Voyager AI** es una aplicación web de planificación inteligente de viajes. El usuario introduce un destino, un rango de fechas y sus intereses personales; el sistema orquesta múltiples fuentes de datos externas (clima, noticias, geolocalización) y las envía como contexto enriquecido a un modelo de razonamiento (Google Gemini 2.0 Flash), que devuelve un itinerario completo y estructurado en JSON. La interfaz renderiza esa respuesta como un *dashboard* visual con tarjetas dinámicas, línea de tiempo por días y alertas contextuales.

---

## 2. Arquitectura Global

<img width="7750" height="5080" alt="Travel Itinerary Generation-2026-03-21-160642" src="https://github.com/user-attachments/assets/99e91440-6493-4f85-994e-6ce005a16963" />


### Flujo de datos

1. El usuario rellena el formulario en el frontend (destino, fechas, intereses).
2. El frontend envía un `POST /api/plan` al backend.
3. El backend ejecuta **en paralelo** (asyncio):
   - Consulta a **Open-Meteo** → datos de clima para las fechas indicadas.
   - Consulta a **NewsAPI** → noticias recientes sobre el destino.
4. Con los datos recopilados, el backend construye un **prompt contextualizado** y lo envía a **Gemini 2.0 Flash**, forzando salida JSON.
5. El backend valida el JSON de Gemini, lo enriquece si es necesario y lo devuelve al frontend.
6. El frontend renderiza el JSON en un dashboard con tarjetas, timeline y alertas.

---

## 3. Stack Tecnológico

| Capa | Tecnología | Justificación |
|------|-----------|---------------|
| **Frontend** | React 18 + Vite | SPA rápida, HMR instantáneo, ecosistema maduro |
| **Estilos** | Tailwind CSS 3.4 | Utilidades `backdrop-blur`, `bg-opacity`, bordes redondeados para glassmorphism |
| **Componentes UI** | shadcn/ui + Radix UI | Componentes accesibles, sin opinión visual, personalizables |
| **Iconos** | Lucide React | Vectores SVG limpios — prohibido usar emoticonos de texto plano |
| **Backend** | Python 3.12 + FastAPI | Async nativo, tipado fuerte, documentación OpenAPI automática |
| **HTTP Client** | httpx (async) | Llamadas concurrentes a APIs externas |
| **IA** | Google Gemini 2.0 Flash | Motor de razonamiento con salida JSON forzada |
| **Clima** | Open-Meteo API | Gratuita, sin key, datos horarios de previsión |
| **Noticias** | NewsAPI.org | Noticias por keyword/localización, requiere API key gratuita |
| **Contenedores** | Docker + Docker Compose | Despliegue reproducible: `docker-compose up -d` |
| **Exportación** | html2pdf.js / jsPDF | Generación de PDF desde el navegador |

---

## 4. Listado de Requisitos

### 4.1 Requisitos Funcionales

| ID | Requisito | Prioridad |
|----|-----------|-----------|
| **RF-01** | El sistema debe ejecutarse con `docker-compose up -d`, levantando frontend y backend simultáneamente | Alta |
| **RF-02** | El frontend debe presentar un formulario para capturar: destino, fecha de inicio, fecha de fin e intereses (selección múltiple mediante píldoras con iconos) | Alta |
| **RF-03** | El backend debe enviar a Gemini un prompt que fuerce la respuesta como JSON estructurado, rechazando respuestas en texto plano o Markdown | Alta |
| **RF-04** | La interfaz debe renderizar la respuesta JSON como un dashboard de tarjetas dinámicas (no bloques de texto) | Alta |
| **RF-05** | El itinerario debe mostrarse como una timeline vertical separada por días, con hora, icono descriptivo del lugar y consejo IA por actividad | Alta |
| **RF-06** | Las incidencias (clima adverso, huelgas, obras) deben mostrarse como tarjetas de advertencia con iconos de alerta y bordes de color cálido | Media |
| **RF-07** | El usuario debe poder exportar el resultado (dashboard) como PDF o como archivo JSON descargable | Media |
| **RF-08** | El backend debe realizar las llamadas a APIs externas de forma concurrente (asyncio/gather) para minimizar el tiempo de respuesta | Alta |
| **RF-09** | El formulario debe validar que las fechas sean coherentes (fin ≥ inicio) y que el destino no esté vacío | Alta |
| **RF-10** | La vista de procesamiento debe mostrar indicadores de progreso por etapa ("Consultando clima…", "Generando itinerario…") | Media |

### 4.2 Requisitos No Funcionales

| ID | Requisito | Prioridad |
|----|-----------|-----------|
| **RNF-01** | La interfaz debe aplicar diseño glassmorphism: transparencias, desenfoque de fondo (`backdrop-blur`), esquinas redondeadas y sombras suaves | Alta |
| **RNF-02** | El tiempo de respuesta total (orquestación de APIs + generación IA) debe ser inferior a 10 segundos en condiciones normales | Alta |
| **RNF-03** | Está prohibido mostrar bloques de texto genéricos; toda información de la IA debe estar categorizada y segmentada visualmente en tarjetas | Alta |
| **RNF-04** | El repositorio no debe contener tokens ni contraseñas. Toda configuración sensible se gestionará mediante archivos `.env` con plantillas `.env.template` | Alta |
| **RNF-05** | El sistema debe ser ejecutable sin necesidad de instalación local más allá de Docker y Docker Compose | Alta |
| **RNF-06** | Toda la iconografía debe ser vectorial (Lucide). Queda prohibido el uso de emoticonos Unicode | Media |

---

## 5. Interfaces y Estructuras de Datos

### 5.1 Contrato de API

#### `POST /api/plan`

**Request Body:**
```json
{
  "destino": "Berlín, Alemania",
  "fechas": {
    "inicio": "2026-03-25",
    "fin": "2026-03-27"
  },
  "intereses": ["tecnología", "museos", "gastronomía"],
  "presupuesto": "medio",
  "restricciones": ["vegetariano", "movilidad reducida"]
}
```

**Response (200 OK):**
```json
{
  "resumen": {
    "destino": "Berlín, Alemania",
    "fecha_inicio": "2026-03-25",
    "fecha_fin": "2026-03-27",
    "clima_general": "Cielos parcialmente nublados, temperaturas entre 3°C y 9°C.",
    "noticias_relevantes": [
      "El metro U2 tendrá interrupciones por obras hasta abril."
    ]
  },
  "advertencias": [
    {
      "tipo": "transporte",
      "icono": "alert-triangle",
      "severidad": "media",
      "mensaje": "Corte por obras en la línea U2 del U-Bahn. Se recomienda utilizar la línea S1 como alternativa."
    }
  ],
  "itinerario": [
    {
      "dia": "Día 1 — 25 de Marzo",
      "actividades": [
        {
          "hora": "10:00",
          "lugar": "Museo Alemán de Tecnología",
          "tipo_icono": "cpu",
          "descripcion": "Colección interactiva de historia de la computación y la aviación.",
          "consejo_ia": "Compra la entrada combinada online para evitar las colas matutinas. La sección de aviación cierra a las 15:00.",
          "coste_estimado": "8€"
        },
        {
          "hora": "13:30",
          "lugar": "Markthalle Neun",
          "tipo_icono": "utensils",
          "descripcion": "Mercado gastronómico con opciones vegetarianas y street food local.",
          "consejo_ia": "El jueves es 'Street Food Thursday', el día más animado. Prueba los Spätzle veganos.",
          "coste_estimado": "12€"
        }
      ]
    }
  ],
  "consejos_generales": [
    {
      "icono": "wind",
      "categoria": "clima",
      "mensaje": "Lleva un cortavientos; las zonas abiertas cerca del río Spree tendrán ráfagas de hasta 30 km/h."
    },
    {
      "icono": "credit-card",
      "categoria": "presupuesto",
      "mensaje": "La Berlin WelcomeCard (AB) cuesta 23€ para 3 días e incluye transporte público y descuentos en museos."
    }
  ],
  "presupuesto_estimado": {
    "transporte": "23€",
    "alimentacion": "90€",
    "entradas": "35€",
    "total": "148€"
  }
}
```

#### `GET /api/health`

Comprobación de estado del backend.

```json
{
  "status": "ok",
  "version": "2.0.0",
  "apis": {
    "open_meteo": "reachable",
    "newsapi": "reachable",
    "gemini": "reachable"
  }
}
```

### 5.2 Modelos de datos internos (Backend — Pydantic)

```python
class TravelRequest(BaseModel):
    destino: str
    fechas: DateRange
    intereses: list[str]
    presupuesto: str = "medio"
    restricciones: list[str] = []

class DateRange(BaseModel):
    inicio: date
    fin: date

class Advertencia(BaseModel):
    tipo: str
    icono: str
    severidad: str
    mensaje: str

class Actividad(BaseModel):
    hora: str
    lugar: str
    tipo_icono: str
    descripcion: str
    consejo_ia: str
    coste_estimado: str

class DiaItinerario(BaseModel):
    dia: str
    actividades: list[Actividad]

class ConsejoGeneral(BaseModel):
    icono: str
    categoria: str
    mensaje: str

class PresupuestoEstimado(BaseModel):
    transporte: str
    alimentacion: str
    entradas: str
    total: str

class TravelResponse(BaseModel):
    resumen: dict
    advertencias: list[Advertencia]
    itinerario: list[DiaItinerario]
    consejos_generales: list[ConsejoGeneral]
    presupuesto_estimado: PresupuestoEstimado
```

### 5.3 Tipos TypeScript (Frontend)

```typescript
interface TravelRequest {
  destino: string;
  fechas: { inicio: string; fin: string };
  intereses: string[];
  presupuesto?: string;
  restricciones?: string[];
}

interface Advertencia {
  tipo: string;
  icono: string;
  severidad: string;
  mensaje: string;
}

interface Actividad {
  hora: string;
  lugar: string;
  tipo_icono: string;
  descripcion: string;
  consejo_ia: string;
  coste_estimado: string;
}

interface DiaItinerario {
  dia: string;
  actividades: Actividad[];
}

interface ConsejoGeneral {
  icono: string;
  categoria: string;
  mensaje: string;
}

interface PresupuestoEstimado {
  transporte: string;
  alimentacion: string;
  entradas: string;
  total: string;
}

interface TravelResponse {
  resumen: {
    destino: string;
    fecha_inicio: string;
    fecha_fin: string;
    clima_general: string;
    noticias_relevantes: string[];
  };
  advertencias: Advertencia[];
  itinerario: DiaItinerario[];
  consejos_generales: ConsejoGeneral[];
  presupuesto_estimado: PresupuestoEstimado;
}
```

---

## 6. APIs Externas — Estado de Validación

| API | Endpoint | Auth | Estado | Notas |
|-----|----------|------|--------|-------|
| **Open-Meteo** | `https://api.open-meteo.com/v1/forecast` | Ninguna (gratuita) | ✅ Operativa | Sin límite de rate. Devuelve previsión horaria hasta 16 días. |
| **NewsAPI** | `https://newsapi.org/v2/everything` | API Key (gratuita) | ✅ Operativa | Plan gratuito: 100 req/día, noticias hasta 1 mes atrás. Suficiente para prototipo. |
| **Gemini 2.0 Flash** | `https://generativelanguage.googleapis.com/v1beta/` | API Key (Google AI Studio) | ✅ Operativa | Requiere key obtenida en https://aistudio.google.com/apikey. Tier gratuito: 15 RPM / 1M TPM. |
| **Google Maps Geocoding** | `https://maps.googleapis.com/maps/api/geocode/json` | API Key (Google Cloud) | ⚠️ Condicional | Requiere billing habilitado en Google Cloud. Se usa Open-Meteo Geocoding como alternativa gratuita. |

> **Nota sobre Google Maps:** La API de Geocoding de Google requiere una cuenta de facturación activa, aunque el free tier cubre el uso de prototipo. Como alternativa sin coste, se utiliza el endpoint de geocodificación de Open-Meteo (`https://geocoding-api.open-meteo.com/v1/search`) que devuelve coordenadas suficientes para nuestro caso de uso.

---

## 7. Prototipos / Tests de Tecnologías (PoC)

Cada prototipo está en la carpeta `poc/` y puede ejecutarse de forma independiente.

| PoC | Archivo | Qué demuestra | Cómo ejecutar |
|-----|---------|----------------|---------------|
| **1. APIs de datos** | `poc/test_apis.py` | Conexión a Open-Meteo y NewsAPI; extrae clima y noticias para un destino dado | `python poc/test_apis.py` |
| **2. Prompt a Gemini** | `poc/test_gemini.py` | Envío de prompt contextualizado a Gemini; verifica que la respuesta sea JSON válido | `python poc/test_gemini.py` |
| **3. Renderizado frontend** | `poc/test_render/` | Componente React que recibe un JSON estático y pinta las tarjetas con Tailwind + Lucide | `cd poc/test_render && npm install && npm run dev` |
| **4. Docker** | `docker-compose.yml` | Build y despliegue simultáneo de frontend y backend | `docker-compose up -d` |

> **⚠️ Para ejecutar los prototipos que requieren API keys**, copia el archivo `.env.template` a `.env` y rellena los valores. Instrucciones de obtención de keys en la sección 8.

---

## 8. Configuración de Credenciales

El repositorio incluye un archivo `.env.template` que debe copiarse a `.env` antes de ejecutar:

```bash
cp .env.template .env
```

### Obtención de API keys

1. **NewsAPI:**
   - Regístrate en [https://newsapi.org/register](https://newsapi.org/register)
   - Copia tu API key desde el dashboard
   - Pégala en `NEWSAPI_KEY` del `.env`

2. **Google Gemini:**
   - Accede a [https://aistudio.google.com/apikey](https://aistudio.google.com/apikey)
   - Crea una nueva API key
   - Pégala en `GEMINI_API_KEY` del `.env`

---

## 9. Instrucciones de Ejecución

### Opción A: Docker (recomendada)

```bash
# 1. Clonar el repositorio
git clone <url-del-repo>
cd voyager-ai

# 2. Configurar credenciales
cp .env.template .env
# Editar .env con tus API keys

# 3. Levantar todo
docker-compose up -d

# 4. Acceder
# Frontend: http://localhost:5173
# Backend:  http://localhost:8000
# Docs API: http://localhost:8000/docs
```

### Opción B: Desarrollo local

```bash
# Backend
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
cp .env.template .env  # Rellenar keys
uvicorn app.main:app --reload --port 8000

# Frontend (otro terminal)
cd frontend
npm install
npm run dev
```

---

## 10. Estructura del Repositorio

```
voyager-ai/
├── Agent.md                    # Este documento
├── docker-compose.yml          # Orquestación de contenedores
├── .env.template               # Plantilla de variables de entorno
├── .gitignore                  # Excluye .env, node_modules, __pycache__, etc.
│
├── backend/
│   ├── Dockerfile
│   ├── requirements.txt
│   └── app/
│       ├── main.py             # Punto de entrada FastAPI
│       ├── config.py           # Carga de variables de entorno
│       ├── models.py           # Modelos Pydantic (request/response)
│       ├── services/
│       │   ├── weather.py      # Cliente Open-Meteo
│       │   ├── news.py         # Cliente NewsAPI
│       │   ├── geocoding.py    # Geocodificación (Open-Meteo)
│       │   └── gemini.py       # Cliente Gemini + Prompt Builder
│       └── routers/
│           └── planner.py      # Endpoints /api/plan, /api/health
│
├── frontend/
│   ├── Dockerfile
│   ├── package.json
│   ├── vite.config.ts
│   ├── tailwind.config.js
│   ├── index.html
│   └── src/
│       ├── App.tsx
│       ├── main.tsx
│       ├── types/
│       │   └── travel.ts       # Interfaces TypeScript
│       ├── components/
│       │   ├── PlanForm.tsx     # Formulario de entrada
│       │   ├── LoadingView.tsx  # Vista de procesamiento
│       │   ├── Dashboard.tsx    # Dashboard de resultados
│       │   ├── Timeline.tsx     # Timeline de itinerario
│       │   ├── AlertCard.tsx    # Tarjetas de advertencia
│       │   └── TipCard.tsx     # Tarjetas de consejos
│       └── lib/
│           └── api.ts          # Cliente HTTP al backend
│
└── poc/
    ├── test_apis.py            # PoC 1: Open-Meteo + NewsAPI
    ├── test_gemini.py          # PoC 2: Prompt engineering
    └── test_render/            # PoC 3: Renderizado de tarjetas
        ├── package.json
        └── src/
```
