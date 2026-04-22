import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Compass, X } from 'lucide-react';

type ModalType = 'privacidad' | 'terminos' | 'equipo' | null;

export function Footer() {
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <footer className="relative mt-auto border-t border-slate-200 bg-white/50 backdrop-blur-lg">
      <div className="px-6 py-12 mx-auto max-w-6xl">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center shadow-lg">
              <Compass className="w-6 h-6 text-white" />
            </div>
            <div>
              <h4 className="m-0 text-xl font-bold text-slate-800">Voyager AI</h4>
              <p className="text-sm text-slate-500 mt-1">Tu próxima experiencia, diseñado por Inteligencia Artificial.</p>
            </div>
          </div>
          
          <nav className="flex flex-wrap gap-6 text-sm justify-center">
            <button 
              onClick={() => setActiveModal('privacidad')}
              className="text-slate-500 hover:text-indigo-600 transition-colors font-medium bg-transparent border-none cursor-pointer"
            >
              Privacidad
            </button>
            <button 
              onClick={() => setActiveModal('terminos')}
              className="text-slate-500 hover:text-indigo-600 transition-colors font-medium bg-transparent border-none cursor-pointer"
            >
              Términos
            </button>
            <button 
              onClick={() => setActiveModal('equipo')}
              className="text-slate-500 hover:text-indigo-600 transition-colors font-medium bg-transparent border-none cursor-pointer"
            >
              Acerca del Equipo
            </button>
          </nav>
        </div>
        
        <div className="mt-8 pt-8 border-t border-slate-200/60 text-center text-sm text-slate-400">
          <p>© 2026 ISI Voyager AI. Desarrollo por López C., Alameda A. y Calzado C.</p>
        </div>
      </div>

      {/* Modal Overlay */}
      {mounted && activeModal && createPortal(
        <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="relative w-full max-w-md p-8 bg-white/90 backdrop-blur-xl border border-white/60 rounded-3xl shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <button 
              onClick={() => setActiveModal(null)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-full transition-colors cursor-pointer border-none"
            >
              <X className="w-5 h-5" />
            </button>
            
            {activeModal === 'privacidad' && (
              <div>
                <h3 className="mb-4 text-2xl font-bold text-slate-800">Política de Privacidad</h3>
                <div className="text-slate-600 leading-relaxed space-y-4">
                  <p>
                    En Voyager AI, nuestro compromiso fundamental es garantizar la máxima seguridad y el respeto absoluto a la privacidad de sus datos. 
                  </p>
                  <p>
                    Cumplimos rigurosamente con el <strong>Reglamento General de Protección de Datos (RGPD)</strong> de la Unión Europea. La arquitectura de nuestro sistema se ha diseñado bajo los principios de privacidad desde el diseño: <strong>no almacenamos, perfilamos ni comercializamos datos personales bajo ninguna circunstancia.</strong>.
                  </p>
                  <p>
                    Toda la información introducida durante el uso de la aplicación (destinos, fechas, preferencias) se procesa de manera efímera para interactuar con los motores de Inteligencia Artificial de Google (Gemini) en la generación de su itinerario y se descarta una vez completada la solicitud.
                  </p>
                </div>
              </div>
            )}

            {activeModal === 'terminos' && (
              <div>
                <h3 className="mb-4 text-2xl font-bold text-slate-800">Términos de Servicio</h3>
                <div className="text-slate-600 leading-relaxed space-y-4">
                  <p>
                    Al utilizar Voyager AI, usted acepta que el servicio se ofrece "tal cual" como herramienta de asistencia tecnológica para la planificación de viajes.
                  </p>
                  <p>
                    <strong>No recopilamos información.</strong> Nuestra aplicación funciona sin necesidad de registro ni bases de datos de usuarios. No empleamos cookies persistentes, rastreadores analíticos ni sistemas de telemetría de terceros.
                  </p>
                  <p>
                    El sistema integra servicios externos en tiempo real (Open-Meteo, NewsAPI) para contextualizar las recomendaciones. Voyager AI no se hace responsable de las posibles fluctuaciones o imprecisiones en los datos proporcionados por estos terceros, instando al usuario a corroborar las decisiones de viaje críticas de forma independiente.
                  </p>
                </div>
              </div>
            )}

            {activeModal === 'equipo' && (
              <div>
                <h3 className="mb-6 text-2xl font-bold text-slate-800">Nuestro Equipo</h3>
                <ul className="space-y-4 text-slate-600 p-0 m-0 list-none">
                  <li className="flex flex-col p-3 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="font-semibold text-slate-800 text-lg">Javier López</span>
                    <span className="text-sm text-indigo-600 font-medium">Desarrollador backend</span>
                  </li>
                  <li className="flex flex-col p-3 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="font-semibold text-slate-800 text-lg">Rubén Calzado</span>
                    <span className="text-sm text-purple-600 font-medium">Desarrollador frontend</span>
                  </li>
                  <li className="flex flex-col p-3 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="font-semibold text-slate-800 text-lg">Adrián Alameda</span>
                    <span className="text-sm text-pink-600 font-medium">Testing</span>
                  </li>
                </ul>
              </div>
            )}

          </div>
        </div>,
        document.body
      )}
    </footer>
  );
}
