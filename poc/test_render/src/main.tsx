/**
 * PoC 3 — Renderizado dinámico de tarjetas desde JSON estático.
 *
 * Demuestra que el frontend puede:
 *   1. Recibir un JSON con la estructura TravelResponse
 *   2. Iterar sobre los arrays
 *   3. Renderizar tarjetas con Tailwind CSS (glassmorphism)
 *   4. Mostrar iconos Lucide según el campo tipo_icono
 */

import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
