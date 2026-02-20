import uuid
from pathlib import Path

import httpx
import structlog

from src.config.settings import settings

from .models import VideoRequest, VideoResult

logger = structlog.get_logger()


class TalkingHeadClient:
    """Cliente para el servicio Wan2.2-S2V en el GPU pod.

    Envía avatar + audio al GPU pod y recibe un video de talking head.
    """

    def __init__(self):
        self.base_url = f"http://{settings.gpu_pod_host}:{settings.gpu_pod_port}"
        self.api_key = settings.gpu_pod_api_key

    async def generate(self, request: VideoRequest) -> VideoResult:
        """Genera video de talking head enviando avatar + audio al GPU pod."""
        logger.info(
            "talking_head_generating",
            avatar=request.avatar_image_path,
            audio=request.audio_path,
        )

        output_dir = Path(settings.temp_dir) / "talking_head"
        output_dir.mkdir(parents=True, exist_ok=True)
        output_path = output_dir / f"{uuid.uuid4()}.mp4"

        # Leer archivos para enviar al GPU pod
        avatar_data = Path(request.avatar_image_path).read_bytes()
        audio_data = Path(request.audio_path).read_bytes()

        async with httpx.AsyncClient(timeout=600.0) as client:
            response = await client.post(
                f"{self.base_url}/v1/talking-head",
                files={
                    "avatar": ("avatar.png", avatar_data, "image/png"),
                    "audio": ("audio.wav", audio_data, "audio/wav"),
                },
                data={
                    "resolution": request.resolution,
                    "fps": str(request.fps),
                    "model": settings.video_model,
                },
                headers={"Authorization": f"Bearer {self.api_key}"},
            )
            response.raise_for_status()

            with open(output_path, "wb") as f:
                f.write(response.content)

        duration = await self._get_video_duration(str(output_path))

        logger.info("talking_head_complete", output=str(output_path), duration=duration)
        return VideoResult(
            video_path=str(output_path),
            duration_seconds=duration,
            resolution=request.resolution,
            fps=request.fps,
        )

    async def _get_video_duration(self, path: str) -> float:
        """Obtiene la duración del video."""
        import subprocess

        try:
            result = subprocess.run(
                [
                    "ffprobe",
                    "-v", "quiet",
                    "-print_format", "json",
                    "-show_format",
                    path,
                ],
                capture_output=True,
                text=True,
            )
            import json

            data = json.loads(result.stdout)
            return float(data["format"]["duration"])
        except Exception:
            return 0.0

    async def health_check(self) -> bool:
        """Verifica que el servicio de talking head esté disponible."""
        try:
            async with httpx.AsyncClient(timeout=10.0) as client:
                response = await client.get(f"{self.base_url}/health")
                return response.status_code == 200
        except Exception:
            return False
