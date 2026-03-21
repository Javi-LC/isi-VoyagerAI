# ✈️ Voyager AI — Planificador de Viajes Inteligente

![Versión](https://img.shields.io/badge/Versi%C3%B3n-1.0--Sprint%202-blue)
![React](https://img.shields.io/badge/Frontend-React%2018%20%7C%20Vite-61DAFB?logo=react&logoColor=black)
![FastAPI](https://img.shields.io/badge/Backend-FastAPI%20%7C%20Python-009688?logo=fastapi&logoColor=white)
![Docker](https://img.shields.io/badge/Despliegue-Docker%20Compose-2496ED?logo=docker&logoColor=white)
![Gemini](https://img.shields.io/badge/IA-Gemini%202.0%20Flash-8E75B2?logo=google-bard&logoColor=white)

**Voyager AI** es una aplicación web de planificación inteligente de viajes. A partir de tu destino, fechas e intereses, el sistema orquesta datos en tiempo real (clima y noticias) y utiliza la potencia de **Google Gemini 2.0 Flash** para generar un itinerario de viaje completo, estructurado y altamente personalizado.

---

## 🌿 Flujo de Trabajo y Ramas (Git)

Actualmente, el desarrollo se gestiona a través de las siguientes ramas principales:

* **`dev`**: Rama principal de desarrollo e integración. Contiene el código estable que ha pasado las pruebas de los distintos sprints.
* **`sprint2`**: Rama activa actual. Enfocada en la definición de la arquitectura global, creación de prototipos (PoC) y validación tecnológica (Marzo 2026). Todos los PRs (Pull Requests) de este sprint deben apuntar aquí antes de fusionarse con `dev`.

---

## ✨ Características Principales

* **Generación Estructurada IA:** Prompts avanzados que obligan a la IA a devolver un JSON estricto, eliminando respuestas genéricas de texto plano.
* **Contexto en Tiempo Real:** Integración asíncrona con Open-Meteo y NewsAPI para advertir sobre clima adverso, huelgas o eventos locales.
* **Interfaz Glassmorphism:** Un dashboard dinámico construido con Tailwind CSS, Shadcn/ui y Radix UI, que incluye tarjetas interactivas y líneas de tiempo.
* **Arquitectura Concurrente:** Backend en FastAPI que ejecuta llamadas a APIs externas en paralelo (`asyncio`), garantizando respuestas en menos de 10 segundos.

---

## 🛠️ Stack Tecnológico

| Capa | Tecnologías Clave |
| :--- | :--- |
| **Frontend** | React 18, Vite, Tailwind CSS 3.4, Shadcn/ui, Lucide Icons |
| **Backend** | Python 3.12, FastAPI, Httpx (Async), Pydantic |
| **Inteligencia Artificial** | Google Gemini 2.0 Flash API |
| **Integraciones Externas** | Open-Meteo API (Clima/Geocoding), NewsAPI (Contexto) |
| **Infraestructura** | Docker, Docker Compose |

---

## 🚀 Guía de Inicio Rápido

La forma más sencilla y recomendada de levantar todo el ecosistema es utilizando Docker.

### 1. Clonar el repositorio y cambiar a la rama activa
```bash
git clone <url-del-repo> voyager-ai
cd voyager-ai
git checkout sprint2
```

## 🏗️ Arquitectura y Flujo de Datos
A continuación se detalla el flujo de ejecución principal al solicitar un nuevo plan de viaje (`POST /api/plan`), demostrando la orquestación concurrente del backend y la comunicación con la IA:

```mermaid
sequenceDiagram
    actor Usuario
    participant Frontend as Frontend (React/Vite)
    participant Backend as Backend (FastAPI)
    participant Externos as APIs Externas (Open-Meteo / NewsAPI)
    participant Gemini as Gemini 2.0 Flash

    Usuario->>Frontend: Rellena formulario (destino, fechas, intereses)
    Frontend->>Backend: POST /api/plan (JSON)
    
    note over Backend: Ejecución Concurrente (asyncio.gather)
    par Fetch Clima
        Backend->>Externos: Petición Open-Meteo
    and Fetch Noticias
        Backend->>Externos: Petición NewsAPI
    end
    Externos-->>Backend: Datos brutos
    
    Backend->>Backend: Orquestador: Construye Prompt contextualizado
    Backend->>Gemini: Prompt forzando salida JSON
    Gemini-->>Backend: Devuelve itinerario en JSON estructurado
    Backend->>Backend: Valida JSON (Pydantic Models)
    Backend-->>Frontend: 200 OK (TravelResponse)
    
    Frontend->>Frontend: Renderiza Dashboard (Tarjetas, Timeline, Alertas)
    Frontend-->>Usuario: Muestra plan de viaje visual
