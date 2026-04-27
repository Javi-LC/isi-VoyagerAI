import { ItineraryData } from '../types/travel';

export interface TravelRequest {
  destino: string;
  fechas: { inicio: string; fin: string };
  intereses: string[];
  presupuesto: string;
  restricciones: string[];
}

export type TravelResponse = ItineraryData;

const API_BASE_CANDIDATES = [
  '/api/v1',
  'http://localhost:8001/api/v1',
  'http://127.0.0.1:8001/api/v1',
];
const FALLBACK_STATUS_CODES = new Set([405, 502, 503, 504]);

function createIdempotencyKey(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return `trip-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

async function fetchWithFallback(path: string, options: RequestInit, signal: AbortSignal): Promise<Response> {
  let lastResponse: Response | null = null;
  let lastNetworkError: TypeError | null = null;

  for (let i = 0; i < API_BASE_CANDIDATES.length; i++) {
    const baseUrl = API_BASE_CANDIDATES[i];
    const isLastBase = i === API_BASE_CANDIDATES.length - 1;

    try {
      const response = await fetch(`${baseUrl}${path}`, { ...options, signal });
      if (!FALLBACK_STATUS_CODES.has(response.status) || isLastBase) {
        return response;
      }
      lastResponse = response;
    } catch (err) {
      if (err instanceof TypeError && !signal.aborted) {
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
  throw new Error('No se pudo conectar con la API.');
}

export async function generateTripPlan(request: TravelRequest): Promise<TravelResponse> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 120_000); // 120s timeout
  const sanitizedRequest: TravelRequest = {
    ...request,
    intereses: request.intereses.filter(Boolean),
    restricciones: request.restricciones.filter(Boolean),
  };
  const idempotencyKey = createIdempotencyKey();

  try {
    const response = await fetchWithFallback(
      '/plan',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          'X-Idempotency-Key': idempotencyKey,
        },
        body: JSON.stringify(sanitizedRequest),
      },
      controller.signal,
    );

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

      if (response.status === 405) {
        throw new Error('El backend rechazo la solicitud del viaje (405). Reinicia los contenedores y vuelve a intentar.');
      }

      throw new Error(detail);
    }

    return response.json();
  } catch (err) {
    if (err instanceof DOMException && err.name === 'AbortError') {
      throw new Error('La solicitud tardo demasiado (>120s). Intenta con un viaje mas corto o menos intereses.');
    }
    if (err instanceof TypeError) {
      throw new Error('No se pudo conectar con el backend. Verifica que los contenedores esten activos y que los puertos 5173/8001 no esten ocupados.');
    }
    throw err;
  } finally {
    clearTimeout(timeoutId);
  }
}

