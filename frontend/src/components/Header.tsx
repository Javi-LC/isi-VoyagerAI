import React from 'react';
import { ActiveSection } from '../types/travel';
import { Compass } from 'lucide-react';

interface HeaderProps {
  activeSection: ActiveSection;
  onSectionChange: (section: ActiveSection) => void;
}

export function Header({ activeSection, onSectionChange }: HeaderProps) {
  return (
    <header className="sticky top-0 z-[1000] px-6 py-4 backdrop-blur-md bg-white/70 border-b border-white/20 shadow-sm">
      <div className="flex justify-between items-center mx-auto max-w-[1200px]">
        <div className="flex gap-3 items-center">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
            <Compass className="w-6 h-6 text-white" />
          </div>
          <h1 className="m-0 text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
            Voyager AI
          </h1>
        </div>
        <nav className="flex gap-8 max-sm:hidden">
          <button
            className={`px-3 py-2 text-base transition-all cursor-pointer rounded-lg hover:bg-white/50 ${
              activeSection === 'landing' ? 'font-semibold text-indigo-600 bg-white/60 shadow-sm' : 'text-slate-600'
            }`}
            onClick={() => onSectionChange('landing')}
          >
            Inicio
          </button>
          <button
            className={`px-3 py-2 text-base transition-all cursor-pointer rounded-lg hover:bg-white/50 ${
              activeSection === 'planner' ? 'font-semibold text-indigo-600 bg-white/60 shadow-sm' : 'text-slate-600'
            }`}
            onClick={() => onSectionChange('planner')}
          >
            Planificar Viaje
          </button>
          <button
            className={`px-3 py-2 text-base transition-all cursor-pointer rounded-lg hover:bg-white/50 ${
              activeSection === 'history' ? 'font-semibold text-indigo-600 bg-white/60 shadow-sm' : 'text-slate-600'
            }`}
            onClick={() => onSectionChange('history')}
          >
            Mis Viajes
          </button>
        </nav>
      </div>
    </header>
  );
}
