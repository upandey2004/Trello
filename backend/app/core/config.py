from pathlib import Path
from pydantic_settings import BaseSettings, SettingsConfigDict

BASE_DIR = Path(__file__).resolve().parents[3]

print("BASE_DIR:", BASE_DIR)
print("ENV:", BASE_DIR / ".env")
print("Exists:", (BASE_DIR / ".env").exists())

class Settings(BaseSettings):
    PROJECT_NAME: str = "Trello Clone API"
    SUPABASE_URL: str
    SUPABASE_KEY: str

    model_config = SettingsConfigDict(
        env_file=BASE_DIR / ".env",
        extra="ignore"
    )

settings = Settings()

print(settings.model_dump())