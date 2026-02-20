import subprocess
import uuid
from pathlib import Path

import structlog
from PIL import Image

from src.config.settings import settings

from .models import CompositionConfig

logger = structlog.get_logger()


class VideoCompositor:
    """Compone el video final de UGC combinando talking head + producto + overlays.

    Usa FFmpeg para la composición del video final con:
    - Video base de talking head
    - Overlays de imágenes del producto (picture-in-picture)
    - Subtítulos/texto
    - Transiciones
    """

    async def compose(self, config: CompositionConfig) -> str:
        """Compone el video UGC final."""
        logger.info("compositing_video", talking_head=config.talking_head_path)

        output_dir = Path(settings.output_dir)
        output_dir.mkdir(parents=True, exist_ok=True)

        if not config.output_path:
            config.output_path = str(output_dir / f"ugc_{uuid.uuid4()}.mp4")

        # Paso 1: Preparar imágenes del producto como overlay
        overlay_paths = []
        if config.add_product_overlay and config.product_images:
            overlay_paths = await self._prepare_product_overlays(
                config.product_images, config.resolution
            )

        # Paso 2: Construir el comando FFmpeg de composición
        ffmpeg_cmd = self._build_ffmpeg_command(config, overlay_paths)

        # Paso 3: Ejecutar FFmpeg
        logger.info("running_ffmpeg", cmd_length=len(ffmpeg_cmd))
        result = subprocess.run(
            ffmpeg_cmd,
            capture_output=True,
            text=True,
            timeout=300,
        )

        if result.returncode != 0:
            logger.error("ffmpeg_failed", stderr=result.stderr[:500])
            raise RuntimeError(f"FFmpeg falló: {result.stderr[:500]}")

        logger.info("composition_complete", output=config.output_path)
        return config.output_path

    async def _prepare_product_overlays(
        self, image_paths: list[str], resolution: tuple[int, int]
    ) -> list[str]:
        """Prepara las imágenes del producto como overlays redimensionados."""
        prepared = []
        overlay_dir = Path(settings.temp_dir) / "overlays"
        overlay_dir.mkdir(parents=True, exist_ok=True)

        width, height = resolution
        overlay_size = (int(width * 0.4), int(width * 0.4))  # 40% del ancho

        for i, img_path in enumerate(image_paths[:4]):
            try:
                img = Image.open(img_path)
                img.thumbnail(overlay_size, Image.LANCZOS)

                # Agregar fondo blanco con esquinas redondeadas
                bg = Image.new("RGBA", img.size, (255, 255, 255, 240))
                if img.mode == "RGBA":
                    bg.paste(img, mask=img)
                else:
                    bg.paste(img)

                out_path = overlay_dir / f"overlay_{i}.png"
                bg.save(str(out_path))
                prepared.append(str(out_path))
            except Exception as e:
                logger.warning("overlay_prep_failed", image=img_path, error=str(e))

        return prepared

    def _build_ffmpeg_command(
        self, config: CompositionConfig, overlay_paths: list[str]
    ) -> list[str]:
        """Construye el comando FFmpeg para la composición."""
        width, height = config.resolution

        cmd = [
            "ffmpeg", "-y",
            "-i", config.talking_head_path,
        ]

        # Agregar inputs de overlays
        for path in overlay_paths:
            cmd.extend(["-i", path])

        # Construir filtro complejo
        filter_parts = []
        current_stream = "[0:v]"

        if overlay_paths:
            # Cada overlay aparece en un segmento diferente del video
            for i, _ in enumerate(overlay_paths):
                input_idx = i + 1
                # Calcular timing para cada overlay (distribuir equitativamente)
                segment_duration = 5  # 5 segundos por overlay
                start_time = 3 + (i * segment_duration)  # Empezar después del hook
                end_time = start_time + segment_duration

                # Posicionar overlay en la esquina superior derecha
                x_pos = width - int(width * 0.42)
                y_pos = int(height * 0.05)

                overlay_stream = f"[{input_idx}:v]"
                out_stream = f"[v{i}]"

                filter_parts.append(
                    f"{current_stream}{overlay_stream}overlay="
                    f"x={x_pos}:y={y_pos}:"
                    f"enable='between(t,{start_time},{end_time})'"
                    f"{out_stream}"
                )
                current_stream = out_stream

        # Escalar a resolución final
        final_stream = current_stream if current_stream != "[0:v]" else "[0:v]"
        filter_parts.append(f"{final_stream}scale={width}:{height}[vout]")

        if filter_parts:
            cmd.extend(["-filter_complex", ";".join(filter_parts)])
            cmd.extend(["-map", "[vout]", "-map", "0:a?"])
        else:
            cmd.extend(["-vf", f"scale={width}:{height}"])

        # Output settings
        cmd.extend([
            "-c:v", "libx264",
            "-preset", "medium",
            "-crf", "23",
            "-c:a", "aac",
            "-b:a", "128k",
            "-movflags", "+faststart",
            "-r", str(config.fps),
            config.output_path,
        ])

        return cmd

    async def add_subtitles(self, video_path: str, segments: list[dict]) -> str:
        """Agrega subtítulos al video usando FFmpeg drawtext."""
        output_path = video_path.replace(".mp4", "_sub.mp4")

        # Generar archivo SRT
        srt_path = video_path.replace(".mp4", ".srt")
        self._generate_srt(srt_path, segments)

        cmd = [
            "ffmpeg", "-y",
            "-i", video_path,
            "-vf", f"subtitles={srt_path}:force_style='FontSize=22,PrimaryColour=&HFFFFFF&,"
            "OutlineColour=&H000000&,Outline=2,Alignment=2,MarginV=80'",
            "-c:a", "copy",
            output_path,
        ]

        result = subprocess.run(cmd, capture_output=True, text=True, timeout=300)
        if result.returncode != 0:
            logger.warning("subtitle_failed", stderr=result.stderr[:300])
            return video_path  # Retornar video sin subtítulos si falla

        return output_path

    def _generate_srt(self, path: str, segments: list[dict]) -> None:
        """Genera un archivo SRT a partir de los segmentos del guion."""
        lines = []
        current_time = 0.0

        for i, seg in enumerate(segments, 1):
            text = seg.get("text", "")
            # Estimar duración basada en longitud del texto (~150 palabras/minuto)
            words = len(text.split())
            duration = max(2.0, words / 2.5)

            start = self._format_srt_time(current_time)
            end = self._format_srt_time(current_time + duration)

            lines.append(f"{i}")
            lines.append(f"{start} --> {end}")
            lines.append(text)
            lines.append("")

            current_time += duration

        with open(path, "w", encoding="utf-8") as f:
            f.write("\n".join(lines))

    def _format_srt_time(self, seconds: float) -> str:
        """Formatea segundos al formato SRT (HH:MM:SS,mmm)."""
        h = int(seconds // 3600)
        m = int((seconds % 3600) // 60)
        s = int(seconds % 60)
        ms = int((seconds % 1) * 1000)
        return f"{h:02d}:{m:02d}:{s:02d},{ms:03d}"
