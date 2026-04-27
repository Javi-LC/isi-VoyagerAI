import { ItineraryData } from '../types/travel';

export interface TripSummary {
  id: number;
  destino: string;
  fecha_inicio: string;
  fecha_fin: string;
  fecha_creacion: string;
}

const API_BASE_CANDIDATES = [
  '/api/v1',
  'http://localhost:8001/api/v1',
  'http://127.0.0.1:8001/api/v1',
];
const FALLBACK_STATUS_CODES = new Set([502, 503, 504]);

async function fetchHistoryWithFallback(path: string): Promise<Response> {
  let lastResponse: Response | null = null;
  let lastNetworkError: TypeError | null = null;

  for (let i = 0; i < API_BASE_CANDIDATES.length; i++) {
    const baseUrl = API_BASE_CANDIDATES[i];
    const isLastBase = i === API_BASE_CANDIDATES.length - 1;

    try {
      const response = await fetch(`${baseUrl}${path}`, {
        headers: {
          Accept: 'application/json',
        },
      });

      if (!FALLBACK_STATUS_CODES.has(response.status) || isLastBase) {
        return response;
      }
      lastResponse = response;
    } catch (err) {
      if (err instanceof TypeError) {
        lastNetworkError = err;
        continue;
      }
      throw err;
    }
  }

  if (lastResponse) {
    return lastResponse;
  }
  if (lastNetworkError) {
    throw lastNetworkError;
  }
  throw new Error('No se pudo conectar con la API de historial.');
}

export async function getTripsHistory(): Promise<TripSummary[]> {
  try {
    const response = await fetchHistoryWithFallback('/trips');

    if (!response.ok) {
      throw new Error(`Error al obtener historial: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching trips history:', error);
    throw error;
  }
}

export async function getTripById(tripId: number): Promise<ItineraryData> {
  try {
    const response = await fetchHistoryWithFallback(`/trips/${tripId}`);

    if (!response.ok) {
      throw new Error(`Error al obtener viaje ${tripId}: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Error fetching trip ${tripId}:`, error);
    throw error;
  }
}
