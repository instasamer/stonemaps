"""Gestión del GPU pod bajo demanda (RunPod/Vast.ai).

Enciende el pod cuando se necesita, lo apaga cuando termina.
"""

import asyncio
import uuid
from pathlib import Path

import httpx
import structlog

from src.config.settings import settings

logger = structlog.get_logger()


class GPUPodManager:
    """Gestiona el ciclo de vida del GPU pod bajo demanda.

    Soporta RunPod como backend principal.
    El pod ejecuta un servidor HTTP con endpoints para:
      - POST /v1/tts (Text-to-Speech con Fish Speech)
      - POST /v1/i2v (Image-to-Video con Wan2.2-I2V)
      - GET /health
    """

    def __init__(self):
        self.api_key = settings.gpu_pod_api_key
        self.pod_host = settings.gpu_pod_host
        self.pod_port = settings.gpu_pod_port
        self._base_url = f"http://{self.pod_host}:{self.pod_port}"

    async def ensure_running(self) -> dict:
        """Asegura que el GPU pod esté corriendo. Lo enciende si no lo está."""
        # Primero verificar si ya está corriendo
        if await self._health_check():
            logger.info("gpu_pod_already_running")
            return {"status": "running", "host": self.pod_host}

        # Encender el pod via RunPod API
        logger.info("gpu_pod_starting")
        pod_info = await self._start_pod()

        # Esperar a que esté listo (max 5 min)
        await self._wait_for_ready(timeout=300)

        return pod_info

    async def stop_if_idle(self) -> None:
        """Apaga el pod si no hay más trabajos pendientes."""
        logger.info("gpu_pod_stopping")
        try:
            await self._stop_pod()
        except Exception as e:
            logger.warning("gpu_pod_stop_failed", error=str(e))

    async def generate_i2v_clips(
        self,
        image_urls: list[str],
        storyboard: list[dict],
        duration: int,
    ) -> list[str]:
        """Genera clips Image-to-Video en el GPU pod.

        Cada imagen del producto se convierte en un clip con movimiento
        basado en las indicaciones del storyboard.
        """
        output_dir = Path(settings.temp_dir) / "i2v_clips"
        output_dir.mkdir(parents=True, exist_ok=True)

        clip_paths = []

        # Distribuir duración entre los clips
        n_clips = min(len(image_urls), len(storyboard), 6)
        if n_clips == 0:
            return []

        clip_duration = duration / n_clips

        async with httpx.AsyncClient(timeout=300.0) as client:
            for i in range(n_clips):
                image_url = image_urls[i] if i < len(image_urls) else image_urls[-1]
                segment = storyboard[i] if i < len(storyboard) else storyboard[-1]

                prompt = self._build_i2v_prompt(segment)

                # Descargar imagen primero
                img_data = await self._download_image(client, image_url)
                if not img_data:
                    continue

                # Enviar al GPU pod para I2V
                response = await client.post(
                    f"{self._base_url}/v1/i2v",
                    files={"image": ("product.jpg", img_data, "image/jpeg")},
                    data={
                        "prompt": prompt,
                        "duration": str(clip_duration),
                        "fps": "24",
                    },
                    headers={"Authorization": f"Bearer {self.api_key}"},
                )
                response.raise_for_status()

                clip_path = str(output_dir / f"clip_{i}_{uuid.uuid4().hex[:6]}.mp4")
                with open(clip_path, "wb") as f:
                    f.write(response.content)

                clip_paths.append(clip_path)
                logger.info("i2v_clip_generated", clip=i, path=clip_path)

        return clip_paths

    def _build_i2v_prompt(self, segment: dict) -> str:
        """Construye el prompt para I2V basado en el segmento del storyboard."""
        parts = []

        visual = segment.get("visual", "")
        if visual:
            parts.append(visual)

        camera = segment.get("camera", "")
        if camera:
            parts.append(f"Camera: {camera}")

        return ". ".join(parts) if parts else "Smooth slow zoom in on product"

    async def _download_image(self, client: httpx.AsyncClient, url: str) -> bytes | None:
        """Descarga una imagen desde URL."""
        try:
            resp = await client.get(url, follow_redirects=True, timeout=30.0)
            resp.raise_for_status()
            return resp.content
        except Exception as e:
            logger.warning("image_download_failed", url=url[:80], error=str(e))
            return None

    async def _health_check(self) -> bool:
        try:
            async with httpx.AsyncClient(timeout=10.0) as client:
                resp = await client.get(f"{self._base_url}/health")
                return resp.status_code == 200
        except Exception:
            return False

    async def _start_pod(self) -> dict:
        """Enciende el pod via RunPod API.

        TODO: Configurar con tu template ID y GPU type de RunPod.
        """
        async with httpx.AsyncClient(timeout=60.0) as client:
            resp = await client.post(
                "https://api.runpod.io/v2/pods",
                json={
                    "name": "ugc-bot-gpu",
                    "imageName": "ugc-bot-gpu:latest",  # Tu imagen Docker del GPU pod
                    "gpuTypeId": "NVIDIA RTX 5090",
                    "volumeInGb": 50,
                    "containerDiskInGb": 20,
                    "ports": f"{self.pod_port}/http",
                    "env": {
                        "API_KEY": self.api_key,
                    },
                },
                headers={"Authorization": f"Bearer {self.api_key}"},
            )
            resp.raise_for_status()
            data = resp.json()

            # Actualizar host con el del pod recién creado
            if "podIp" in data:
                self.pod_host = data["podIp"]
                self._base_url = f"http://{self.pod_host}:{self.pod_port}"

            return data

    async def _stop_pod(self) -> None:
        """Apaga el pod via RunPod API."""
        async with httpx.AsyncClient(timeout=30.0) as client:
            await client.post(
                f"https://api.runpod.io/v2/pods/stop",
                json={"podId": "ugc-bot-gpu"},
                headers={"Authorization": f"Bearer {self.api_key}"},
            )

    async def _wait_for_ready(self, timeout: int = 300) -> None:
        """Espera hasta que el pod esté listo, con backoff."""
        elapsed = 0
        wait = 5
        while elapsed < timeout:
            if await self._health_check():
                logger.info("gpu_pod_ready", elapsed=elapsed)
                return
            await asyncio.sleep(wait)
            elapsed += wait
            wait = min(wait * 1.5, 30)  # Backoff hasta 30s
        raise TimeoutError(f"GPU pod no respondió en {timeout}s")
