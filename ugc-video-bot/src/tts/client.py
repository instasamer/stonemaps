import uuid
from pathlib import Path

import httpx
import structlog

from src.config.settings import settings

from .models import TTSRequest, TTSResult

logger = structlog.get_logger()


class TTSClient:
    """Cliente para comunicarse con el servicio de TTS en el GPU pod.

    El GPU pod ejecuta Fish Speech v1.5 y expone una API HTTP.
    Este cliente envía el texto y recibe el audio generado.
    """

    def __init__(self):
        self.base_url = f"http://{settings.gpu_pod_host}:{settings.gpu_pod_port}"
        self.api_key = settings.gpu_pod_api_key

    async def generate(self, request: TTSRequest) -> TTSResult:
        """Genera audio TTS enviando el request al GPU pod."""
        logger.info("tts_generating", text_length=len(request.text), voice=request.voice_id)

        output_dir = Path(settings.temp_dir) / "tts"
        output_dir.mkdir(parents=True, exist_ok=True)
        output_path = output_dir / f"{uuid.uuid4()}.wav"

        async with httpx.AsyncClient(timeout=120.0) as client:
            response = await client.post(
                f"{self.base_url}/v1/tts",
                json={
                    "text": request.text,
                    "voice_id": request.voice_id,
                    "language": request.language,
                    "speed": request.speed,
                    "emotion": request.emotion,
                    "format": "wav",
                },
                headers={"Authorization": f"Bearer {self.api_key}"},
            )
            response.raise_for_status()

            # El GPU pod devuelve el audio directamente como bytes
            with open(output_path, "wb") as f:
                f.write(response.content)

        # Obtener duración del audio
        duration = await self._get_audio_duration(str(output_path))

        logger.info("tts_complete", output=str(output_path), duration=duration)
        return TTSResult(
            audio_path=str(output_path),
            duration_seconds=duration,
        )

    async def _get_audio_duration(self, path: str) -> float:
        """Obtiene la duración del archivo de audio en segundos."""
        import wave

        try:
            with wave.open(path, "r") as wav:
                frames = wav.getnframes()
                rate = wav.getframerate()
                return frames / float(rate)
        except Exception:
            # Fallback: estimar duración basada en tamaño del archivo
            size = Path(path).stat().st_size
            return size / (24000 * 2)  # 24kHz, 16-bit mono

    async def list_voices(self) -> list[dict]:
        """Lista las voces disponibles en el GPU pod."""
        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.get(
                f"{self.base_url}/v1/voices",
                headers={"Authorization": f"Bearer {self.api_key}"},
            )
            response.raise_for_status()
            return response.json()

    async def health_check(self) -> bool:
        """Verifica que el servicio TTS esté disponible."""
        try:
            async with httpx.AsyncClient(timeout=10.0) as client:
                response = await client.get(f"{self.base_url}/health")
                return response.status_code == 200
        except Exception:
            return False
