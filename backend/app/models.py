from pydantic import BaseModel
from datetime import date
from typing import List, Optional

class DateRange(BaseModel):
    inicio: date
    fin: date

class TravelRequest(BaseModel):
    origen: str
    destino: str
    fechas: DateRange
    intereses: List[str]
    presupuesto: str = "medio"
    restricciones: List[str] = []

class Advertencia(BaseModel):
    tipo: str
    icono: str
    severidad: str
    mensaje: str

class Actividad(BaseModel):
    hora: str
    lugar: str
    lat: Optional[float] = None
    lng: Optional[float] = None
    tipo_icono: str
    descripcion: str
    consejo_ia: str
    coste_estimado: str

class DiaItinerario(BaseModel):
    dia: str
    actividades: List[Actividad]

class ConsejoGeneral(BaseModel):
    icono: str
    categoria: str
    mensaje: str

class PresupuestoEstimado(BaseModel):
    transporte: str
    alimentacion: str
    entradas: str
    total: str

class TravelResponse(BaseModel):
    resumen: dict
    advertencias: List[Advertencia]
    itinerario: List[DiaItinerario]
    consejos_generales: List[ConsejoGeneral]
    presupuesto_estimado: PresupuestoEstimado
