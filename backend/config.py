"""Configuration settings for the application"""
import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    # HuggingFace
    HF_MODEL: str = os.getenv("HF_MODEL", "microsoft/phi-2")
    HF_TOKEN: str = os.getenv("HF_TOKEN", "")
    
    # Model settings
    DEVICE: str = os.getenv("DEVICE", "cuda" if os.path.exists("/proc/driver/nvidia/version") else "cpu")
    QUANTIZATION: str = os.getenv("QUANTIZATION", "4bit")
    TEMPERATURE: float = float(os.getenv("TEMPERATURE", "0.7"))
    MAX_LENGTH: int = int(os.getenv("MAX_LENGTH", "2048"))
    
    # Database
    MONGODB_URI: str = os.getenv("MONGODB_URI", "mongodb://mongo:27017/code_generator")
    QDRANT_HOST: str = os.getenv("QDRANT_HOST", "qdrant")
    QDRANT_PORT: int = int(os.getenv("QDRANT_PORT", "6333"))
    
    # Environment
    ENVIRONMENT: str = os.getenv("ENVIRONMENT", "production")
    USE_AI_MODEL: bool = os.getenv("USE_AI_MODEL", "false").lower() == "true"

    class Config:
        env_file = ".env"

settings = Settings()
