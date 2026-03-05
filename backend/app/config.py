"""Voyager AI — Configuración centralizada."""

from pydantic_settings import BaseSettings
from functools import lru_cache


class Settings(BaseSettings):
    # --- API Keys ---
    newsapi_key: str = ""
    gemini_api_key: str = ""

    # --- Servicios ---
    open_meteo_base: str = "https://api.open-meteo.com/v1"
    geocoding_base: str = "https://geocoding-api.open-meteo.com/v1"
    newsapi_base: str = "https://newsapi.org/v2"
    gemini_model: str = "gemini-2.0-flash"

    # --- App ---
    app_name: str = "Voyager AI"
    app_version: str = "2.0.0"
    cors_origins: list[str] = ["http://localhost:5173", "http://localhost:3000"]

    model_config = {"env_file": ".env", "env_file_encoding": "utf-8"}


@lru_cache
def get_settings() -> Settings:
    return Settings()
