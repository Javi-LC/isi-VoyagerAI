import { CloudSun, Newspaper, Cpu, CheckCircle } from "lucide-react";

interface Props {
  step: number; // 0-3
}

const STEPS = [
  { icon: CloudSun, label: "Consultando datos meteorológicos…" },
  { icon: Newspaper, label: "Buscando noticias del destino…" },
  { icon: Cpu, label: "Generando itinerario con IA…" },
  { icon: CheckCircle, label: "Preparando tu viaje…" },
];

export default function LoadingView({ step }: Props) {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="glass-card w-full max-w-md p-10 text-center space-y-8 animate-fade-in">
        {/* Spinner */}
        <div className="relative mx-auto h-20 w-20">
          <div className="absolute inset-0 rounded-full border-4 border-white/10" />
          <div className="absolute inset-0 rounded-full border-4 border-t-cyan-400 animate-spin" />
        </div>

        {/* Steps */}
        <div className="space-y-4">
          {STEPS.map(({ icon: Icon, label }, i) => {
            const isActive = i === step;
            const isDone = i < step;

            return (
              <div
                key={i}
                className={`flex items-center gap-3 rounded-xl px-4 py-3 transition-all duration-500 ${
                  isActive
                    ? "bg-cyan-400/10 border border-cyan-400/30 text-cyan-300"
                    : isDone
                    ? "text-green-400/70"
                    : "text-slate-500"
                }`}
              >
                {isDone ? (
                  <CheckCircle className="h-5 w-5 text-green-400 shrink-0" />
                ) : (
                  <Icon
                    className={`h-5 w-5 shrink-0 ${
                      isActive ? "animate-pulse" : ""
                    }`}
                  />
                )}
                <span className="text-sm text-left">{label}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
