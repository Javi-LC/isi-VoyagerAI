"""Voyager AI — Modelos Pydantic (Request / Response)."""

from __future__ import annotations
from datetime import date
from pydantic import BaseModel, field_validator


# ── Request ──────────────────────────────────────────────

class DateRange(BaseModel):
    inicio: date
    fin: date

    @field_validator("fin")
    @classmethod
    def fin_after_inicio(cls, v: date, info) -> date:
        inicio = info.data.get("inicio")
        if inicio and v < inicio:
            raise ValueError("La fecha de fin debe ser igual o posterior a la de inicio.")
        return v


class TravelRequest(BaseModel):
    destino: str
    fechas: DateRange
    intereses: list[str] = []
    presupuesto: str = "medio"
    restricciones: list[str] = []

    @field_validator("destino")
    @classmethod
    def destino_not_empty(cls, v: str) -> str:
        if not v.strip():
            raise ValueError("El destino no puede estar vacío.")
        return v.strip()


# ── Response ─────────────────────────────────────────────

class Advertencia(BaseModel):
    tipo: str
    icono: str
    severidad: str = "media"
    mensaje: str


class Actividad(BaseModel):
    hora: str
    lugar: str
    tipo_icono: str
    descripcion: str = ""
    consejo_ia: str = ""
    coste_estimado: str = ""


class DiaItinerario(BaseModel):
    dia: str
    actividades: list[Actividad]


class ConsejoGeneral(BaseModel):
    icono: str
    categoria: str = ""
    mensaje: str


class PresupuestoEstimado(BaseModel):
    transporte: str = ""
    alimentacion: str = ""
    entradas: str = ""
    total: str = ""


class Resumen(BaseModel):
    destino: str
    fecha_inicio: str
    fecha_fin: str
    clima_general: str = ""
    noticias_relevantes: list[str] = []


class TravelResponse(BaseModel):
    resumen: Resumen
    advertencias: list[Advertencia] = []
    itinerario: list[DiaItinerario] = []
    consejos_generales: list[ConsejoGeneral] = []
    presupuesto_estimado: PresupuestoEstimado | None = None


# ── Health ───────────────────────────────────────────────

class HealthResponse(BaseModel):
    status: str = "ok"
    version: str
    apis: dict[str, str] = {}
