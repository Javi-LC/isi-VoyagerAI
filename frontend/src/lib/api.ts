import type { TravelRequest, TravelResponse } from "@/types/travel";

const API_BASE = "/api";

export async function planTrip(data: TravelRequest): Promise<TravelResponse> {
  const res = await fetch(`${API_BASE}/plan`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: "Error desconocido" }));
    throw new Error(err.detail || `Error ${res.status}`);
  }

  return res.json();
}

export async function healthCheck(): Promise<Record<string, unknown>> {
  const res = await fetch(`${API_BASE}/health`);
  return res.json();
}
