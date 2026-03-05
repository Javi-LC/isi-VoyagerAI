import { useState, useEffect, useCallback } from "react";
import PlanForm from "./components/PlanForm";
import LoadingView from "./components/LoadingView";
import Dashboard from "./components/Dashboard";
import { planTrip } from "./lib/api";
import type { TravelRequest, TravelResponse } from "./types/travel";

type AppView = "form" | "loading" | "dashboard" | "error";

export default function App() {
  const [view, setView] = useState<AppView>("form");
  const [loadingStep, setLoadingStep] = useState(0);
  const [result, setResult] = useState<TravelResponse | null>(null);
  const [error, setError] = useState("");

  // Simulated loading steps (the backend does the real work)
  useEffect(() => {
    if (view !== "loading") return;
    const timers = [
      setTimeout(() => setLoadingStep(1), 1200),
      setTimeout(() => setLoadingStep(2), 2800),
      setTimeout(() => setLoadingStep(3), 5000),
    ];
    return () => timers.forEach(clearTimeout);
  }, [view]);

  const handleSubmit = useCallback(async (data: TravelRequest) => {
    setView("loading");
    setLoadingStep(0);
    setError("");

    try {
      const res = await planTrip(data);
      setResult(res);
      setView("dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error inesperado");
      setView("error");
    }
  }, []);

  const handleReset = () => {
    setView("form");
    setResult(null);
    setError("");
    setLoadingStep(0);
  };

  switch (view) {
    case "form":
      return <PlanForm onSubmit={handleSubmit} loading={false} />;

    case "loading":
      return <LoadingView step={loadingStep} />;

    case "dashboard":
      return result ? (
        <Dashboard data={result} onReset={handleReset} />
      ) : null;

    case "error":
      return (
        <div className="flex min-h-screen items-center justify-center px-4">
          <div className="glass-card w-full max-w-md p-8 text-center space-y-4">
            <div className="text-red-400 text-4xl">⚠</div>
            <h2 className="text-xl font-bold text-white">
              Error al generar el itinerario
            </h2>
            <p className="text-sm text-slate-400">{error}</p>
            <button onClick={handleReset} className="glass-button text-white">
              Intentar de nuevo
            </button>
          </div>
        </div>
      );
  }
}
