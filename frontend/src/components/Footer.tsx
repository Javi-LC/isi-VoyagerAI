import React from 'react';
import { Compass } from 'lucide-react';

export function Footer() {
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
              <p className="text-sm text-slate-500 mt-1">Sprint 3 - Arquitectura & Prototipos</p>
            </div>
          </div>
          
          <nav className="flex flex-wrap gap-6 text-sm justify-center">
            <a href="#" className="text-slate-500 hover:text-indigo-600 transition-colors font-medium">Privacidad</a>
            <a href="#" className="text-slate-500 hover:text-indigo-600 transition-colors font-medium">Términos</a>
            <a href="#" className="text-slate-500 hover:text-indigo-600 transition-colors font-medium">Acerca del Equipo</a>
          </nav>
        </div>
        
        <div className="mt-8 pt-8 border-t border-slate-200/60 text-center text-sm text-slate-400">
          <p>© 2026 ISI Voyager AI. Desarrollo por López C., Alameda A. y Calzado C.</p>
        </div>
      </div>
    </footer>
  );
}
