import { ItineraryData } from '../types/travel';

export interface TravelRequest {
  destino: string;
  fechas: { inicio: string; fin: string };
  intereses: string[];
  presupuesto: string;
  restricciones: string[];
}

export type TravelResponse = ItineraryData;

const API_BASE_URL = 'http://localhost:8000/api/v1';

export async function generateTripPlan(request: TravelRequest): Promise<TravelResponse> {
  const response = await fetch(`${API_BASE_URL}/plan`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || 'Error al conectar con la IA. Por favor, intenta de nuevo.');
  }

  return response.json();
}
