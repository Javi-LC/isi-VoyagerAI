import type { ConsejoGeneral } from "@/types/travel";
import { getIcon } from "@/lib/icons";

interface Props {
  consejo: ConsejoGeneral;
}

export default function TipCard({ consejo }: Props) {
  const Icon = getIcon(consejo.icono);

  return (
    <div className="glass-card-hover flex items-start gap-3 p-4 animate-slide-up">
      <div className="rounded-lg bg-purple-400/10 p-2">
        <Icon className="h-4 w-4 text-purple-400" />
      </div>
      <div className="space-y-1">
        {consejo.categoria && (
          <span className="text-xs font-semibold uppercase tracking-wider text-purple-400/80">
            {consejo.categoria}
          </span>
        )}
        <p className="text-sm leading-relaxed text-slate-300">
          {consejo.mensaje}
        </p>
      </div>
    </div>
  );
}
