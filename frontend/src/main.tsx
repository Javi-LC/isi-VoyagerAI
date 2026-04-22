import React from 'react';
import ReactDOM from 'react-dom/client';
// Importamos tu componente principal
import TravelApp from './App'; 

// Buscamos el div "root" de tu HTML y dibujamos la app dentro
ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <TravelApp />
  </React.StrictMode>
);