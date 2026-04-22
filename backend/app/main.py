from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.routers import planner
from app.database import engine, Base
from app import db_models

# Crear tablas en la BD
db_models.Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Voyager AI Backend",
    version="2.0.0",
    description="Backend para la planificación inteligente de viajes."
)

# Configurar CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Registrar enrutadores
app.include_router(planner.router, prefix="/api/v1")
