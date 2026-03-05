import {
  AlertTriangle, Cpu, Utensils, MapPin, Palette, TreePine,
  Wind, CreditCard, Train, Landmark, Clock,
  type LucideIcon,
} from "lucide-react";
import { MOCK_RESPONSE } from "./mockData";

/* ── Icon lookup ── */
const iconMap: Record<string, LucideIcon> = {
  "alert-triangle": AlertTriangle, cpu: Cpu, utensils: Utensils,
  "map-pin": MapPin, palette: Palette, "tree-pine": TreePine,
  wind: Wind, "credit-card": CreditCard, train: Train, landmark: Landmark,
  clock: Clock,
};
const getIcon = (name: string) => iconMap[name.toLowerCase()] || MapPin;

/* ── Severity colors ── */
const sevColors: Record<string, string> = {
  alta: "border-red-400/40 bg-red-400/10 text-red-300",
  media: "border-amber-400/40 bg-amber-400/10 text-amber-300",
  baja: "border-blue-400/40 bg-blue-400/10 text-blue-300",
};

export default function App() {
  const { resumen, advertencias, itinerario, consejos_generales, presupuesto_estimado } = MOCK_RESPONSE;

  return (
    <div className="max-w-4xl mx-auto py-10 px-4 space-y-8">
      {/* Header */}
      <div className="text-center mb-6">
        <p className="text-cyan-400 text-xs font-bold uppercase tracking-widest mb-2">
          PoC 3 — Renderizado Dinámico de Tarjetas
        </p>
        <h1 className="text-3xl font-bold">Voyager AI</h1>
        <p className="text-slate-400 text-sm mt-1">
          Este prototipo consume un JSON estático y genera la interfaz dinámicamente.
        </p>
      </div>

      {/* Resumen */}
      <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 space-y-3">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <MapPin className="h-5 w-5 text-cyan-400" />
          {resumen.destino}
        </h2>
        <p className="text-slate-400 text-sm">{resumen.fecha_inicio} → {resumen.fecha_fin}</p>
        <p className="text-sm text-slate-300 bg-white/5 rounded-lg px-3 py-2">{resumen.clima_general}</p>
      </div>

      {/* Advertencias */}
      <div className="space-y-3">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-amber-400">Advertencias</h2>
        {advertencias.map((a, i) => {
          const Icon = getIcon(a.icono);
          return (
            <div key={i} className={`flex items-start gap-3 rounded-xl border p-4 backdrop-blur-md ${sevColors[a.severidad]}`}>
              <Icon className="h-5 w-5 shrink-0 mt-0.5" />
              <div>
                <span className="text-xs font-bold uppercase opacity-70">{a.tipo}</span>
                <p className="text-sm text-white/90">{a.mensaje}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Itinerario / Timeline */}
      <div className="space-y-6">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-cyan-400">Itinerario</h2>
        {itinerario.map((dia, dIdx) => (
          <div key={dIdx}>
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-cyan-400" />
              {dia.dia}
            </h3>
            <div className="ml-3 border-l border-white/10 pl-6 space-y-4">
              {dia.actividades.map((act, aIdx) => {
                const Icon = getIcon(act.tipo_icono);
                return (
                  <div key={aIdx} className="relative rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-4 space-y-2 hover:bg-white/10 transition-all">
                    <div className="absolute -left-[33px] top-5 h-3 w-3 rounded-full border-2 border-cyan-400 bg-[#0f0f23]" />
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1 text-cyan-400 text-xs font-mono">
                        <Clock className="h-3 w-3" /> {act.hora}
                      </span>
                      <span className="flex items-center gap-1 text-white font-medium text-sm">
                        <Icon className="h-4 w-4 text-cyan-300" /> {act.lugar}
                      </span>
                    </div>
                    <p className="text-slate-400 text-sm">{act.descripcion}</p>
                    {act.consejo_ia && (
                      <div className="rounded-lg bg-cyan-400/5 border border-cyan-400/10 px-3 py-2">
                        <p className="text-xs text-cyan-300/80">💡 {act.consejo_ia}</p>
                      </div>
                    )}
                    <span className="inline-block rounded-full bg-white/5 px-2 py-0.5 text-xs text-slate-400">
                      ~{act.coste_estimado}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Presupuesto */}
      <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-5 space-y-3">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-green-400">Presupuesto Estimado</h2>
        <div className="grid grid-cols-4 gap-3">
          {([
            ["Transporte", presupuesto_estimado.transporte],
            ["Alimentación", presupuesto_estimado.alimentacion],
            ["Entradas", presupuesto_estimado.entradas],
            ["Total", presupuesto_estimado.total],
          ] as const).map(([label, val]) => (
            <div key={label} className={`rounded-xl p-3 text-center ${label === "Total" ? "bg-green-400/10 border border-green-400/20" : "bg-white/5"}`}>
              <p className="text-xs text-slate-400">{label}</p>
              <p className={`text-lg font-bold ${label === "Total" ? "text-green-400" : "text-white"}`}>{val}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Consejos */}
      <div className="space-y-3">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-purple-400">Consejos del Viaje</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {consejos_generales.map((c, i) => {
            const Icon = getIcon(c.icono);
            return (
              <div key={i} className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-4 flex items-start gap-3 hover:bg-white/10 transition-all">
                <div className="rounded-lg bg-purple-400/10 p-2">
                  <Icon className="h-4 w-4 text-purple-400" />
                </div>
                <div>
                  <span className="text-xs font-bold uppercase text-purple-400/80">{c.categoria}</span>
                  <p className="text-sm text-slate-300">{c.mensaje}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer */}
      <p className="text-center text-xs text-slate-600 pt-4">
        PoC 3 — Datos estáticos · Voyager AI Sprint 2
      </p>
    </div>
  );
}
