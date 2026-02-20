from pydantic import BaseModel


class TTSRequest(BaseModel):
    """Request para generar audio TTS."""

    text: str
    voice_id: str = "neutral_female_es"
    language: str = "es"
    speed: float = 1.0
    emotion: str = "neutral"  # "neutral", "happy", "excited", "calm"


class TTSResult(BaseModel):
    """Resultado de la generación TTS."""

    audio_path: str  # Path al archivo de audio generado
    duration_seconds: float
    sample_rate: int = 24000
