import { ItineraryData } from '../types/travel';

export interface TravelRequest {
  destino: string;
  fechas: { inicio: string; fin: string };
  intereses: string[];
  presupuesto: string;
  restricciones: string[];
}

export type TravelResponse = ItineraryData;

const API_BASE_URL = import.meta.env.VITE_API_URL ?? '/api/v1';

export async function generateTripPlan(request: TravelRequest): Promise<TravelResponse> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 90_000); // 90s timeout

  try {
    const response = await fetch(`${API_BASE_URL}/plan`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(request),
      signal: controller.signal,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || `Error ${response.status} al conectar con la IA.`);
    }

    return response.json();
  } catch (err) {
    if (err instanceof DOMException && err.name === 'AbortError') {
      throw new Error('La solicitud tardó demasiado (>90s). Intenta con un viaje más corto.');
    }
    throw err;
  } finally {
    clearTimeout(timeoutId);
  }
}
