import type { Advertencia } from "@/types/travel";
import { getIcon } from "@/lib/icons";

interface Props {
  advertencia: Advertencia;
}

const severityColors: Record<string, string> = {
  alta: "border-red-400/40 bg-red-400/10 text-red-300",
  media: "border-amber-400/40 bg-amber-400/10 text-amber-300",
  baja: "border-blue-400/40 bg-blue-400/10 text-blue-300",
};

export default function AlertCard({ advertencia }: Props) {
  const Icon = getIcon(advertencia.icono);
  const color = severityColors[advertencia.severidad] || severityColors.media;

  return (
    <div
      className={`flex items-start gap-3 rounded-xl border p-4 backdrop-blur-md animate-slide-up ${color}`}
    >
      <Icon className="h-5 w-5 shrink-0 mt-0.5" />
      <div className="space-y-1">
        <span className="text-xs font-semibold uppercase tracking-wider opacity-70">
          {advertencia.tipo}
        </span>
        <p className="text-sm leading-relaxed text-white/90">
          {advertencia.mensaje}
        </p>
      </div>
    </div>
  );
}
