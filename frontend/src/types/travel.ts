/* ── Tipos del contrato de datos Frontend ↔ Backend ── */

export interface TravelRequest {
  destino: string;
  fechas: { inicio: string; fin: string };
  intereses: string[];
  presupuesto?: string;
  restricciones?: string[];
}

export interface Advertencia {
  tipo: string;
  icono: string;
  severidad: string;
  mensaje: string;
}

export interface Actividad {
  hora: string;
  lugar: string;
  tipo_icono: string;
  descripcion: string;
  consejo_ia: string;
  coste_estimado: string;
}

export interface DiaItinerario {
  dia: string;
  actividades: Actividad[];
}

export interface ConsejoGeneral {
  icono: string;
  categoria: string;
  mensaje: string;
}

export interface PresupuestoEstimado {
  transporte: string;
  alimentacion: string;
  entradas: string;
  total: string;
}

export interface Resumen {
  destino: string;
  fecha_inicio: string;
  fecha_fin: string;
  clima_general: string;
  noticias_relevantes: string[];
}

export interface TravelResponse {
  resumen: Resumen;
  advertencias: Advertencia[];
  itinerario: DiaItinerario[];
  consejos_generales: ConsejoGeneral[];
  presupuesto_estimado: PresupuestoEstimado | null;
}
