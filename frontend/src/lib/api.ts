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
  const sanitizedRequest: TravelRequest = {
    ...request,
    intereses: request.intereses.filter(Boolean),
    restricciones: request.restricciones.filter(Boolean),
  };

  try {
    const response = await fetch(`${API_BASE_URL}/plan`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(sanitizedRequest),
      signal: controller.signal,
    });

    if (!response.ok) {
      const rawError = await response.text();
      let detail = `Error ${response.status} al conectar con la IA.`;

      try {
        const errorData = JSON.parse(rawError);
        if (typeof errorData?.detail === 'string') {
          detail = errorData.detail;
        } else if (Array.isArray(errorData?.detail) && errorData.detail.length > 0) {
          detail = errorData.detail[0]?.msg ?? detail;
        }
      } catch {
        if (rawError.trim()) {
          detail = rawError;
        }
      }

      if (/error parsing the body/i.test(detail)) {
        throw new Error('No se pudo procesar la solicitud. Revisa los campos del viaje y vuelve a intentar.');
      }

      throw new Error(detail);
    }

    return response.json();
  } catch (err) {
    if (err instanceof DOMException && err.name === 'AbortError') {
      throw new Error('La solicitud tardó demasiado (>90s). Intenta con un viaje más corto.');
    }
    if (err instanceof TypeError) {
      throw new Error('No se pudo conectar con el backend. Verifica que los contenedores esten activos.');
    }
    throw err;
  } finally {
    clearTimeout(timeoutId);
  }
}
