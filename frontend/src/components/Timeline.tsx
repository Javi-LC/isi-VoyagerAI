import type { DiaItinerario } from "@/types/travel";
import { getIcon } from "@/lib/icons";
import { Clock } from "lucide-react";

interface Props {
  itinerario: DiaItinerario[];
}

export default function Timeline({ itinerario }: Props) {
  return (
    <div className="space-y-8">
      {itinerario.map((dia, dIdx) => (
        <div key={dIdx} className="animate-slide-up" style={{ animationDelay: `${dIdx * 100}ms` }}>
          {/* Day header */}
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-cyan-400" />
            {dia.dia}
          </h3>

          {/* Activities */}
          <div className="relative ml-3 border-l border-white/10 pl-6 space-y-4">
            {dia.actividades.map((act, aIdx) => {
              const Icon = getIcon(act.tipo_icono);
              return (
                <div key={aIdx} className="relative glass-card-hover p-4 space-y-2">
                  {/* Timeline dot */}
                  <div className="absolute -left-[33px] top-5 h-3 w-3 rounded-full border-2 border-cyan-400 bg-[var(--bg-primary)]" />

                  {/* Time + Place */}
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1.5 text-cyan-400 text-xs font-mono">
                      <Clock className="h-3 w-3" />
                      {act.hora}
                    </div>
                    <div className="flex items-center gap-1.5 text-white font-medium text-sm">
                      <Icon className="h-4 w-4 text-cyan-300" />
                      {act.lugar}
                    </div>
                  </div>

                  {/* Description */}
                  {act.descripcion && (
                    <p className="text-slate-400 text-sm leading-relaxed">
                      {act.descripcion}
                    </p>
                  )}

                  {/* AI Tip */}
                  {act.consejo_ia && (
                    <div className="rounded-lg bg-cyan-400/5 border border-cyan-400/10 px-3 py-2">
                      <p className="text-xs text-cyan-300/80 leading-relaxed">
                        💡 {act.consejo_ia}
                      </p>
                    </div>
                  )}

                  {/* Cost */}
                  {act.coste_estimado && (
                    <span className="inline-block rounded-full bg-white/5 px-2 py-0.5 text-xs text-slate-400">
                      ~{act.coste_estimado}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
