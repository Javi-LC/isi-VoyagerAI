# Entorno y Configuración: Voyager AI (Travel App)

Este proyecto es una aplicación React construida con Vite, TypeScript y Tailwind CSS. 

## 1. Ejecución rápida (Primera vez)

Clona el repositorio y ejecuta desde la carpeta `mockups/`:

```bash
npm install
npm run dev
```

¡Listo! Vite iniciará en `http://localhost:5173/` (o el siguiente puerto disponible).

## 2. Archivos de configuración (Ya están en el repo)

Los siguientes archivos ya están incluidos y configurados:
```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}

**`tailwind.config.js`** (Ya presente)
```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

**`index.css`** (Ya presente)
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

body {
  margin: 0;
  padding: 0;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
}
```

**`vite.config.ts`** (Ya presente)
```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
})
```

**`package.json`** (Scripts ya configurados)
```json
{
  "name": "voyager-ai",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview"
  }
}
```

## 3. Archivos base del entorno

Necesitas el HTML principal que carga la aplicación y la configuración de Vite.

**`index.html`** (Ya presente)
```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Voyager AI - Smart Travel Planner</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/main.tsx"></script>
  </body>
</html>
```

Y por último, asegúrate de que el archivo CSS se importa en tu punto de entrada principal (`main.tsx`):

**`main.tsx`** (Ya presente)
```typescript
import './index.css';
import React from 'react';
import ReactDOM from 'react-dom/client';
import TravelApp from './TravelApp'; 
// ... (resto de tu código actual)
```

## 4. Ejecutar el proyecto

Una vez clonado y con deps instaladas:

```bash
npm run dev
```

Vite iniciará un servidor local en `http://localhost:5173/`.

## 5. Funcionalidades ya desarrolladas

- Módulo `ItineraryView` con:
  - resumen de destino, fechas y clima
  - alertas activables (`showAlerts`)
  - itinerario por días con actividades y consejos IA
  - noticias relevantes desde `resumen.noticias_relevantes`
- Módulo `TripPlanner`:
  - selección de presupuesto, intereses y restricciones
  - envío de formulario para generación de itinerario
- Módulo `TravelApp` como controlador global con estado y mock data.

## 6. Comprobación

- Accede a `http://localhost:5173/` (o puerto que Vite asigne)

