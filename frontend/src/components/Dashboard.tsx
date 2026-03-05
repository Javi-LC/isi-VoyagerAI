import {
  MapPin, Calendar, CloudSun, Download, FileJson, ArrowLeft,
  Wallet,
} from "lucide-react";
import type { TravelResponse } from "@/types/travel";
import AlertCard from "./AlertCard";
import TipCard from "./TipCard";
import Timeline from "./Timeline";

interface Props {
  data: TravelResponse;
  onReset: () => void;
}

export default function Dashboard({ data, onReset }: Props) {
  const { resumen, advertencias, itinerario, consejos_generales, presupuesto_estimado } = data;

  const downloadJSON = () => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `voyager-ai-${resumen.destino.replace(/\s+/g, "-")}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportPDF = async () => {
    const el = document.getElementById("dashboard-content");
    if (!el) return;
    // dynamic import for html2pdf
    const html2pdf = (await import("html2pdf.js")).default;
    html2pdf()
      .set({
        margin: 10,
        filename: `voyager-ai-${resumen.destino.replace(/\s+/g, "-")}.pdf`,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
      })
      .from(el)
      .save();
  };

  return (
    <div className="min-h-screen py-8 px-4 md:px-8 max-w-5xl mx-auto space-y-6 animate-fade-in">
      {/* Top bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={onReset}
          className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm"
        >
          <ArrowLeft className="h-4 w-4" />
          Nuevo viaje
        </button>
        <div className="flex gap-2">
          <button
            onClick={downloadJSON}
            className="pill-tag hover:border-cyan-400/50 hover:text-cyan-300"
          >
            <FileJson className="h-3.5 w-3.5" />
            JSON
          </button>
          <button
            onClick={exportPDF}
            className="pill-tag hover:border-cyan-400/50 hover:text-cyan-300"
          >
            <Download className="h-3.5 w-3.5" />
            PDF
          </button>
        </div>
      </div>

      <div id="dashboard-content" className="space-y-6">
        {/* ── Resumen Header ── */}
        <div className="glass-card p-6 space-y-3">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-white flex items-center gap-2">
                <MapPin className="h-6 w-6 text-cyan-400" />
                {resumen.destino}
              </h1>
              <div className="flex items-center gap-4 mt-2 text-sm text-slate-400">
                <span className="flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5" />
                  {resumen.fecha_inicio} → {resumen.fecha_fin}
                </span>
              </div>
            </div>
          </div>
          {resumen.clima_general && (
            <div className="flex items-start gap-2 text-sm text-slate-300 bg-white/5 rounded-lg px-3 py-2">
              <CloudSun className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
              {resumen.clima_general}
            </div>
          )}
          {resumen.noticias_relevantes?.length > 0 && (
            <div className="space-y-1">
              {resumen.noticias_relevantes.map((n, i) => (
                <p key={i} className="text-xs text-slate-400 leading-relaxed">
                  • {n}
                </p>
              ))}
            </div>
          )}
        </div>

        {/* ── Advertencias ── */}
        {advertencias.length > 0 && (
          <div className="space-y-3">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-amber-400/80">
              Advertencias
            </h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {advertencias.map((a, i) => (
                <AlertCard key={i} advertencia={a} />
              ))}
            </div>
          </div>
        )}

        {/* ── Itinerario (Timeline) ── */}
        {itinerario.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-cyan-400/80">
              Itinerario
            </h2>
            <Timeline itinerario={itinerario} />
          </div>
        )}

        {/* ── Presupuesto ── */}
        {presupuesto_estimado && (
          <div className="glass-card p-5 space-y-3">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-green-400/80 flex items-center gap-2">
              <Wallet className="h-4 w-4" />
              Presupuesto Estimado
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {(
                [
                  ["Transporte", presupuesto_estimado.transporte],
                  ["Alimentación", presupuesto_estimado.alimentacion],
                  ["Entradas", presupuesto_estimado.entradas],
                  ["Total", presupuesto_estimado.total],
                ] as const
              ).map(([label, value]) => (
                <div
                  key={label}
                  className={`rounded-xl p-3 text-center ${
                    label === "Total"
                      ? "bg-green-400/10 border border-green-400/20"
                      : "bg-white/5"
                  }`}
                >
                  <p className="text-xs text-slate-400">{label}</p>
                  <p
                    className={`text-lg font-bold ${
                      label === "Total" ? "text-green-400" : "text-white"
                    }`}
                  >
                    {value || "—"}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Consejos Generales ── */}
        {consejos_generales.length > 0 && (
          <div className="space-y-3">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-purple-400/80">
              Consejos del viaje
            </h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {consejos_generales.map((c, i) => (
                <TipCard key={i} consejo={c} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
