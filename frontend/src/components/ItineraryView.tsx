"use client";
import React from 'react';
import { Bell, FileText, AlertTriangle, PartyPopper, ArrowLeft, Sun, Bot } from 'lucide-react';
import { ItineraryData } from '../types/travel';
import { exportToPDF } from '../utils/exportPDF';
import { DayMap } from './DayMap';

interface ItineraryViewProps {
  itineraryData: ItineraryData;
  showAlertas: boolean;
  onToggleAlertas: () => void;
  onBack: () => void;
}

export function ItineraryView({ itineraryData, showAlertas, onToggleAlertas, onBack }: ItineraryViewProps) {
  return (
    <section className="px-6 py-16 bg-gray-50 min-h-[calc(100vh_-_80px)] backdrop-blur-sm bg-opacity-80">
      <div className="mx-auto my-0 max-w-[1200px]">
        
        <button 
          onClick={onBack}
          className="flex items-center gap-2 mb-8 px-4 py-2 text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors font-medium cursor-pointer border-none"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver a planificar viaje
        </button>

        <div className="flex justify-between items-center mb-8 max-sm:flex-col max-sm:gap-4 max-sm:items-start">
          <div>
            <h2 className="m-0 mb-2 text-4xl font-bold text-zinc-900">
              {itineraryData.resumen.origen} ➔ {itineraryData.resumen.destino}
            </h2>
            <p className="m-0 text-base text-stone-500">
              {itineraryData.resumen.fecha_inicio} - {itineraryData.resumen.fecha_fin} • {itineraryData.itinerario.length} Días
            </p>
          </div>
          <div className="flex gap-3">
            <button
              className="px-6 py-3 text-sm font-semibold rounded-xl border-2 border-indigo-500 border-solid transition-all cursor-pointer duration-300 ease-out backdrop-blur-md bg-white/70"
              onClick={onToggleAlertas}
              style={{
                backgroundColor: showAlertas ? '#667eea' : 'rgba(255,255,255,0.7)',
                color: showAlertas ? 'white' : '#667eea',
              }}
            >
              <Bell className="inline w-4 h-4 mr-2" />
              Alertas
            </button>
            <button
              className="px-6 py-3 text-sm font-semibold text-indigo-500 rounded-xl border-2 border-indigo-500 border-solid transition-all cursor-pointer bg-white/70 backdrop-blur-md duration-300 ease-out hover:bg-indigo-50/70"
              onClick={() => exportToPDF(itineraryData)}
            >
              <FileText className="inline w-4 h-4 mr-2" />
              Exportar PDF
            </button>
          </div>
        </div>

        {showAlertas && (
          <div className="p-6 mb-8 rounded-2xl bg-white/80 backdrop-blur-md shadow-[0_4px_12px_rgba(0,0,0,0.08)]">
            <h3 className="mb-4 text-xl font-semibold text-zinc-900">
              Alertas Activas
            </h3>
            {itineraryData.advertencias?.map((alert, index) => (
              <div
                className="p-4 rounded-xl border-l-4 border-solid backdrop-blur-sm"
                key={index}
                style={{
                  marginBottom: index < itineraryData.advertencias.length - 1 ? '12px' : 0,
                  backgroundColor: alert.severidad === 'media' ? 'rgba(255,243,205,0.8)' : 'rgba(209,236,241,0.8)',
                  borderLeftColor: alert.severidad === 'media' ? '#ffc107' : '#17a2b8',
                }}
              >
                <div className="flex gap-3 items-center">
                  <span className="text-xl">
                    {alert.icono === 'alert-triangle' ? <AlertTriangle className="w-5 h-5" /> : <PartyPopper className="w-5 h-5" />}
                  </span>
                  <p className="m-0 text-base font-medium text-zinc-800">
                    {alert.mensaje}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {itineraryData.resumen.noticias_relevantes && itineraryData.resumen.noticias_relevantes.length > 0 && (
          <div className="p-6 mb-8 rounded-2xl bg-white/80 backdrop-blur-md shadow-[0_4px_12px_rgba(0,0,0,0.08)]">
            <h3 className="mb-4 text-xl font-semibold text-zinc-900">
              Noticias Relevantes
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {itineraryData.resumen.noticias_relevantes.map((noticia, idx) => {
                const titulo = typeof noticia === 'string' ? noticia : noticia.titulo;
                const url = typeof noticia === 'string' ? '' : (noticia.url || '');
                return (
                  <div
                    key={idx}
                    className="p-4 rounded-xl border-l-4 border-solid bg-blue-50/60 border-blue-500 hover:shadow-lg transition-all duration-300"
                  >
                    {url ? (
                      <a 
                        href={url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="m-0 text-sm font-medium text-zinc-900 hover:text-indigo-600 transition-colors no-underline"
                      >
                        • {titulo}
                        <span className="ml-2 text-xs text-indigo-500">↗ Leer más</span>
                      </a>
                    ) : (
                      <p className="m-0 text-sm font-medium text-zinc-900">
                        • {titulo}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div className="flex flex-col gap-6">
          {itineraryData.itinerario?.map((day, dayIndex) => (
            <article
              className="p-8 rounded-2xl bg-white/80 backdrop-blur-md shadow-[0_4px_12px_rgba(0,0,0,0.08)]"
              key={dayIndex}
            >
              <div className="flex justify-between items-center pb-4 mb-6 border-b-2 border-solid border-b-zinc-100 max-sm:flex-col max-sm:gap-3 max-sm:items-start">
                <h3 className="m-0 text-2xl font-semibold text-zinc-900">
                  {day.dia}
                </h3>
                <div className="flex gap-2 items-center px-4 py-2 rounded-lg bg-green-100/80 backdrop-blur-sm">
                  <Sun className="w-5 h-5" />
                  <span className="text-sm font-medium text-zinc-800">
                    {itineraryData.resumen.clima_general}
                  </span>
                </div>
              </div>

              <DayMap actividades={day.actividades} />

              <div className="flex flex-col gap-4">
                {day.actividades?.map((activity, activityIndex) => (
                  <div
                    className="flex gap-5 p-5 rounded-xl transition-all duration-300 ease-out hover:shadow-md bg-gray-50/80 backdrop-blur-sm"
                    key={activityIndex}
                  >
                    <div className="flex flex-col items-center min-w-[60px]">
                      <time className="text-base font-semibold text-indigo-500">
                        {activity.hora}
                      </time>
                      <div className="mt-2 w-0.5 h-full bg-neutral-200" />
                    </div>
                    <div className="flex-1">
                      <h4 className="m-0 mb-1 text-lg font-semibold text-zinc-900">
                        {activity.lugar}
                      </h4>
                      <p className="m-0 mb-2 text-sm text-stone-600">
                        {activity.descripcion}
                      </p>
                      <p className="m-0 mb-2 text-sm text-indigo-600 italic">
                        💡 {activity.consejo_ia}
                      </p>
                      <div className="flex gap-3 mt-2">
                        <span className="px-2.5 py-1 text-sm font-medium rounded-md text-stone-500 bg-blue-50/80">
                          {activity.coste_estimado}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </article>
          ))}
        </div>

        <div className="p-8 mt-8 rounded-2xl border-2 border-solid bg-white/80 border-indigo-200/50 backdrop-blur-md shadow-[0_4px_12px_rgba(0,0,0,0.08)]">
          <h3 className="flex gap-2 items-center mb-4 text-xl font-semibold text-zinc-900">
            <Bot className="w-5 h-5" />
            Sugerencias de IA
          </h3>
          <p className="m-0 text-base leading-relaxed text-neutral-600">
            {itineraryData.resumen.clima_general} {itineraryData.consejos_generales.map(advice => advice.mensaje).join(' ')}
          </p>
        </div>
      </div>
    </section>
  );
}
