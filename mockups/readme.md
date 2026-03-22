# Entorno y Configuración: Voyager AI (Travel App)

Este proyecto es una aplicación React construida con Vite, TypeScript y Tailwind CSS. A continuación, se detallan todos los pasos y archivos necesarios para poder ejecutar `npm run dev` exitosamente.

## 1. Inicialización y Dependencias

Asegúrate de estar en la raíz del proyecto. A continuación, ejecuta los siguientes comandos uno tras otro en la terminal para instalar todo y levantar la app:

```bash
npm install
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
npm run dev
```

Modifica el archivo `package.json` para agregar los scripts de ejecución. Debería quedar algo así:

```json
{
  "name": "voyager-ai",
  "version": "1.0.0",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview"
  }
}
```

## 2. Configuración de Tailwind CSS

Ejecuta el siguiente comando para generar los archivos de configuración de Tailwind y PostCSS:

```bash
npx tailwindcss init -p
```

Esto creará un archivo `tailwind.config.js`. Debes editarlo para que Tailwind escanee tus archivos `.tsx`:

**`tailwind.config.js`**
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

Crea o actualiza un archivo de estilos globales donde Tailwind inyectará sus clases:

**`index.css`**
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

## 3. Archivos base del entorno

Necesitas el HTML principal que carga la aplicación y la configuración de Vite.

**`index.html`**
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
    <!-- Carga el punto de entrada de la app -->
    <script type="module" src="/main.tsx"></script>
  </body>
</html>
```

**`vite.config.ts`**
```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
})
```

Y por último, asegúrate de importar el archivo CSS en tu punto de entrada principal (`main.tsx`):

**`main.tsx`** (Solo añade la importación del CSS en la primera línea)
```typescript
import './index.css';
import React from 'react';
import ReactDOM from 'react-dom/client';
import TravelApp from './TravelApp'; 
// ... (resto de tu código actual)
```

## 4. Ejecutar el proyecto

Una vez que tengas todos estos archivos configurados, simplemente levanta el servidor de desarrollo:

```bash
npm run dev
```

Vite iniciará un servidor local rápido, normalmente en `http://localhost:5173/`.

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

- Accede a `http://localhost:5176/` (Vite eligió el puerto disponible)
- Revisa que aparecen las tarjetas de "Noticias Relevantes" en la vista de itinerario.
- Si quieres ampliar, conecta `fetch('/api/v1/plan')` a backend real usando el contrato en `types.ts`.
