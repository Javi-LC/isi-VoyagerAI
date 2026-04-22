from sqlalchemy import Column, Integer, String, DateTime, Text
from sqlalchemy.sql import func
from app.database import Base

class TripRecord(Base):
    __tablename__ = "trips"

    id = Column(Integer, primary_key=True, index=True)
    destino = Column(String, index=True)
    fecha_inicio = Column(String)
    fecha_fin = Column(String)
    itinerario_json = Column(Text) # Almacena el JSON completo
    fecha_creacion = Column(DateTime(timezone=True), server_default=func.now())
