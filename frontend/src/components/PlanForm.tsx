import { useState, type FormEvent } from "react";
import {
  MapPin, Calendar, Sparkles, Send, Utensils, Camera, Music,
  Palette, Book, TreePine, Cpu, ShoppingBag, Heart, Waves,
  Landmark, Theater, Bike,
} from "lucide-react";
import type { TravelRequest } from "@/types/travel";

interface Props {
  onSubmit: (data: TravelRequest) => void;
  loading: boolean;
}

const INTEREST_OPTIONS = [
  { id: "cultura", label: "Cultura", icon: Landmark },
  { id: "gastronomía", label: "Gastronomía", icon: Utensils },
  { id: "fotografía", label: "Fotografía", icon: Camera },
  { id: "música", label: "Música", icon: Music },
  { id: "arte", label: "Arte", icon: Palette },
  { id: "historia", label: "Historia", icon: Book },
  { id: "naturaleza", label: "Naturaleza", icon: TreePine },
  { id: "tecnología", label: "Tecnología", icon: Cpu },
  { id: "compras", label: "Compras", icon: ShoppingBag },
  { id: "romántico", label: "Romántico", icon: Heart },
  { id: "playa", label: "Playa", icon: Waves },
  { id: "teatro", label: "Teatro", icon: Theater },
  { id: "aventura", label: "Aventura", icon: Bike },
];

const BUDGET_OPTIONS = ["bajo", "medio", "alto"];

export default function PlanForm({ onSubmit, loading }: Props) {
  const [destino, setDestino] = useState("");
  const [inicio, setInicio] = useState("");
  const [fin, setFin] = useState("");
  const [intereses, setIntereses] = useState<string[]>([]);
  const [presupuesto, setPresupuesto] = useState("medio");

  const toggleInterest = (id: string) => {
    setIntereses((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!destino.trim() || !inicio || !fin) return;
    onSubmit({
      destino: destino.trim(),
      fechas: { inicio, fin },
      intereses,
      presupuesto,
    });
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12">
      <form
        onSubmit={handleSubmit}
        className="glass-card w-full max-w-xl space-y-6 p-8 animate-fade-in"
      >
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 text-cyan-400">
            <Sparkles className="h-6 w-6" />
            <span className="text-sm font-medium tracking-wide uppercase">
              Voyager AI
            </span>
          </div>
          <h1 className="text-3xl font-bold text-white">
            Planifica tu viaje
          </h1>
          <p className="text-slate-400 text-sm">
            Introduce tu destino y deja que la IA diseñe el itinerario perfecto.
          </p>
        </div>

        {/* Destino */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-medium text-slate-300">
            <MapPin className="h-4 w-4 text-cyan-400" />
            Destino
          </label>
          <input
            type="text"
            placeholder="Ej: Berlín, Alemania"
            value={destino}
            onChange={(e) => setDestino(e.target.value)}
            className="glass-input"
            required
          />
        </div>

        {/* Fechas */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-slate-300">
              <Calendar className="h-4 w-4 text-cyan-400" />
              Inicio
            </label>
            <input
              type="date"
              value={inicio}
              onChange={(e) => setInicio(e.target.value)}
              className="glass-input"
              required
            />
          </div>
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-slate-300">
              <Calendar className="h-4 w-4 text-cyan-400" />
              Fin
            </label>
            <input
              type="date"
              value={fin}
              onChange={(e) => setFin(e.target.value)}
              min={inicio}
              className="glass-input"
              required
            />
          </div>
        </div>

        {/* Intereses */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-slate-300">
            Intereses
          </label>
          <div className="flex flex-wrap gap-2">
            {INTEREST_OPTIONS.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                type="button"
                onClick={() => toggleInterest(id)}
                className={`pill-tag ${
                  intereses.includes(id) ? "pill-tag-active" : ""
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Presupuesto */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-slate-300">
            Presupuesto
          </label>
          <div className="flex gap-3">
            {BUDGET_OPTIONS.map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => setPresupuesto(opt)}
                className={`pill-tag capitalize ${
                  presupuesto === opt ? "pill-tag-active" : ""
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading || !destino.trim() || !inicio || !fin}
          className="glass-button w-full flex items-center justify-center gap-2 text-white disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {loading ? (
            <span className="animate-spin h-5 w-5 border-2 border-white/30 border-t-white rounded-full" />
          ) : (
            <Send className="h-4 w-4" />
          )}
          {loading ? "Generando itinerario…" : "Generar itinerario"}
        </button>
      </form>
    </div>
  );
}
