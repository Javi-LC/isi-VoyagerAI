import React from 'react';
import { Zap, ShieldAlert, Sparkles, Map, ChevronRight } from 'lucide-react';
import { ActiveSection } from '../types/travel';

interface LandingSectionProps {
  onSectionChange: (section: ActiveSection) => void;
}

export function LandingSection({ onSectionChange }: LandingSectionProps) {
  return (
    <div className="min-h-screen bg-slate-50 relative overflow-hidden">
      {/* Background decorations for glassmorphism */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-indigo-400 rounded-full mix-blend-multiply filter blur-[128px] opacity-40 animate-blob"></div>
      <div className="absolute top-[20%] right-[-10%] w-96 h-96 bg-purple-400 rounded-full mix-blend-multiply filter blur-[128px] opacity-40 animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-[-20%] left-[20%] w-96 h-96 bg-pink-400 rounded-full mix-blend-multiply filter blur-[128px] opacity-40 animate-blob animation-delay-4000"></div>

      <section className="relative px-6 py-24 text-center z-10 flex flex-col items-center justify-center min-h-[70vh]">
        <div className="mx-auto max-w-4xl p-10 bg-white/40 backdrop-blur-xl border border-white/50 rounded-3xl shadow-2xl">
          <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 rounded-full bg-white/60 backdrop-blur-md border border-white/60 text-indigo-700 font-medium text-sm">
            <Sparkles className="w-4 h-4" />
            <span>Potenciado por Gemini 2.5 Flash</span>
          </div>
          
          <h2 className="mb-6 text-6xl font-extrabold leading-tight tracking-tight text-slate-800 max-sm:text-4xl">
            Tu próximo viaje, <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
              diseñado por IA
            </span>
          </h2>
          
          <p className="mb-10 text-xl leading-relaxed text-slate-600 max-w-2xl mx-auto">
            Itinerarios inteligentes que se adaptan al clima local, noticias de última hora y tus intereses personales. Todo en segundos.
          </p>
          
          <button
            className="group flex items-center justify-center gap-2 mx-auto px-8 py-4 text-lg font-semibold text-white transition-all bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl hover:shadow-[0_8px_30px_rgba(99,102,241,0.4)] hover:scale-105 active:scale-95"
            onClick={() => onSectionChange('planner')}
          >
            <Map className="w-5 h-5" />
            Comenzar a planificar
            <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </section>

      <section className="relative z-10 px-6 py-20 pb-32 max-w-6xl mx-auto">
        <h3 className="mb-16 text-3xl font-bold text-center text-slate-800">
          ¿Por qué usar Voyager AI?
        </h3>
        
        <div className="grid gap-8 md:grid-cols-3">
          <article className="p-8 bg-white/50 backdrop-blur-lg border border-white/60 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all hover:bg-white/60 hover:-translate-y-1 hover:shadow-xl">
            <div className="mb-6 w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-100 to-indigo-50 flex items-center justify-center border border-indigo-100">
              <Zap className="w-7 h-7 text-indigo-600" />
            </div>
            <h4 className="mb-3 text-xl font-bold text-slate-800">
              Ahorra Tiempo
            </h4>
            <p className="text-slate-600 leading-relaxed">
              Condensa horas de investigación en segundos. Se acabaron las múltiples pestañas con mapas, blogs y aplicaciones del clima.
            </p>
          </article>
          
          <article className="p-8 bg-white/50 backdrop-blur-lg border border-white/60 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all hover:bg-white/60 hover:-translate-y-1 hover:shadow-xl">
            <div className="mb-6 w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-100 to-orange-50 flex items-center justify-center border border-orange-100">
              <ShieldAlert className="w-7 h-7 text-orange-600" />
            </div>
            <h4 className="mb-3 text-xl font-bold text-slate-800">
              Viaja Seguro
            </h4>
            <p className="text-slate-600 leading-relaxed">
              Recibe alertas sobre incidencias en transporte, clima adverso (Open-Meteo) o noticias locales importantes (NewsAPI).
            </p>
          </article>

          <article className="p-8 bg-white/50 backdrop-blur-lg border border-white/60 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all hover:bg-white/60 hover:-translate-y-1 hover:shadow-xl">
            <div className="mb-6 w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-100 to-purple-50 flex items-center justify-center border border-purple-100">
              <Sparkles className="w-7 h-7 text-purple-600" />
            </div>
            <h4 className="mb-3 text-xl font-bold text-slate-800">
              Contexto Inteligente
            </h4>
            <p className="text-slate-600 leading-relaxed">
              Consejos generados por Gemini 2.5 Flash específicamente para tu perfil, preferencias horarias y restricciones físicas.
            </p>
          </article>
        </div>
      </section>
    </div>
  );
}
