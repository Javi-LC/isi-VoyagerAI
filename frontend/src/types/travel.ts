export interface Activity {
  hora: string;
  lugar: string;
  tipo_icono: string;
  descripcion: string;
  consejo_ia: string;
  coste_estimado: string;
}

export interface Day {
  dia: string;
  actividades: Activity[];
}

export interface Alert {
  tipo: string;
  icono: string;
  severidad: 'baja' | 'media' | 'alta';
  mensaje: string;
}

export interface Advice {
  icono: string;
  categoria: string;
  mensaje: string;
}

export interface Budget {
  transporte: string;
  alimentacion: string;
  entradas: string;
  total: string;
}

export interface NoticiaRelevante {
  titulo: string;
  url?: string;
}

export interface Summary {
  destino: string;
  fecha_inicio: string;
  fecha_fin: string;
  clima_general: string;
  noticias_relevantes: NoticiaRelevante[];
}

export interface ItineraryData {
  resumen: Summary;
  advertencias: Alert[];
  itinerario: Day[];
  consejos_generales: Advice[];
  presupuesto_estimado: Budget;
}

export interface Preferences {
  presupuesto: 'bajo' | 'medio' | 'alto';
  restricciones: string[];
  intereses: string[];
}

export type ActiveSection = 'landing' | 'planner' | 'itinerary' | 'history';

export interface TripSummary {
  id: number;
  destino: string;
  fecha_inicio: string;
  fecha_fin: string;
  fecha_creacion: string;
}
