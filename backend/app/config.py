from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import List

class Settings(BaseSettings):
    NEWSAPI_KEY: str = ""
    GEMINI_API_KEY: str = ""
    GEMINI_MODEL: str = "gemini-2.5-flash"
    CORS_ORIGINS: List[str] = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://0.0.0.0:5173",
        "http://localhost:3000",
    ]
    CORS_ORIGIN_REGEX: str = r"^https?://(localhost|127\.0\.0\.1|0\.0\.0\.0|172\.(?:1[6-9]|2\d|3[0-1])\.\d{1,3}\.\d{1,3})(:\d+)?$"

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

settings = Settings()
