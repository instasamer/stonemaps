"""Compositor de video UGC.

Combina clips I2V del producto + voz en off + subtítulos + música
en un video final listo para redes sociales.
"""

import subprocess
import uuid
from pathlib import Path

import structlog

from src.config.settings import settings

from .models import CompositionConfig

logger = structlog.get_logger()


class VideoCompositor:
    """Compone el video UGC final a partir de clips generados por I2V.

    Pipeline FFmpeg:
    1. Concatena clips I2V del producto (con transiciones)
    2. Superpone audio de voz en off
    3. Agrega subtítulos estilo TikTok
    4. Escala al formato correcto (9:16, 1:1, 16:9)
    """

    async def compose(
        self,
        config: CompositionConfig,
        audio_path: str = "",
        video_clips: list[str] | None = None,
    ) -> str:
        """Compone el video UGC final."""
        logger.info(
            "compositing_video",
            clips=len(video_clips or []),
            format=config.resolution,
        )

        output_dir = Path(settings.output_dir)
        output_dir.mkdir(parents=True, exist_ok=True)

        if not config.output_path:
            config.output_path = str(output_dir / f"ugc_{uuid.uuid4()}.mp4")

        width, height = config.resolution

        if video_clips:
            # Paso 1: Concatenar clips con transiciones
            concat_path = await self._concat_clips(video_clips, width, height, config.fps)
        elif config.talking_head_path:
            concat_path = config.talking_head_path
        else:
            raise ValueError("Se necesitan video_clips o talking_head_path")

        # Paso 2: Agregar audio (voz en off)
        if audio_path:
            with_audio_path = await self._add_audio(concat_path, audio_path)
        else:
            with_audio_path = concat_path

        # Paso 3: Subtítulos
        if config.add_subtitles and config.segments:
            final_path = await self.add_subtitles(with_audio_path, config.segments)
        else:
            final_path = with_audio_path

        # Paso 4: Copiar al output final si es diferente
        if final_path != config.output_path:
            self._ffmpeg_copy(final_path, config.output_path)

        logger.info("composition_complete", output=config.output_path)
        return config.output_path

    async def _concat_clips(
        self,
        clip_paths: list[str],
        width: int,
        height: int,
        fps: int,
    ) -> str:
        """Concatena clips con transiciones crossfade."""
        if len(clip_paths) == 1:
            return clip_paths[0]

        output = str(Path(settings.temp_dir) / f"concat_{uuid.uuid4().hex[:8]}.mp4")

        # Crear archivo de lista para concat
        list_path = str(Path(settings.temp_dir) / f"concat_list_{uuid.uuid4().hex[:8]}.txt")
        with open(list_path, "w") as f:
            for clip in clip_paths:
                f.write(f"file '{clip}'\n")

        # Primero escalar todos los clips al mismo tamaño, luego concatenar
        # Usamos filtro complejo para transiciones crossfade
        n = len(clip_paths)
        xfade_duration = 0.5  # 0.5s de transición entre clips

        cmd = ["ffmpeg", "-y"]
        for clip in clip_paths:
            cmd.extend(["-i", clip])

        # Construir filtro complejo con xfade
        filter_parts = []

        # Primero escalar cada input
        for i in range(n):
            filter_parts.append(
                f"[{i}:v]scale={width}:{height}:force_original_aspect_ratio=decrease,"
                f"pad={width}:{height}:(ow-iw)/2:(oh-ih)/2,"
                f"setsar=1,fps={fps}[v{i}]"
            )

        # Luego aplicar xfade entre clips consecutivos
        if n == 2:
            filter_parts.append(
                f"[v0][v1]xfade=transition=fade:duration={xfade_duration}:offset=auto[vout]"
            )
        elif n > 2:
            # Encadenar xfades
            filter_parts.append(
                f"[v0][v1]xfade=transition=fade:duration={xfade_duration}:offset=auto[xf0]"
            )
            for i in range(2, n):
                prev = f"[xf{i - 2}]"
                curr = f"[v{i}]"
                out = "[vout]" if i == n - 1 else f"[xf{i - 1}]"
                filter_parts.append(
                    f"{prev}{curr}xfade=transition=fade:duration={xfade_duration}:offset=auto{out}"
                )
        else:
            filter_parts.append("[v0]copy[vout]")

        cmd.extend(["-filter_complex", ";".join(filter_parts)])
        cmd.extend([
            "-map", "[vout]",
            "-c:v", "libx264", "-preset", "medium", "-crf", "23",
            "-r", str(fps),
            "-movflags", "+faststart",
            output,
        ])

        self._run_ffmpeg(cmd, "concat_clips")
        return output

    async def _add_audio(self, video_path: str, audio_path: str) -> str:
        """Superpone audio de voz en off al video."""
        output = str(Path(settings.temp_dir) / f"with_audio_{uuid.uuid4().hex[:8]}.mp4")

        cmd = [
            "ffmpeg", "-y",
            "-i", video_path,
            "-i", audio_path,
            "-filter_complex",
            "[1:a]apad[a]",  # Pad audio si es más corto que el video
            "-map", "0:v",
            "-map", "[a]",
            "-c:v", "copy",
            "-c:a", "aac", "-b:a", "128k",
            "-shortest",
            "-movflags", "+faststart",
            output,
        ]

        self._run_ffmpeg(cmd, "add_audio")
        return output

    async def add_subtitles(self, video_path: str, segments: list[dict]) -> str:
        """Agrega subtítulos estilo TikTok/Reels."""
        output = video_path.replace(".mp4", "_sub.mp4")
        if output == video_path:
            output = str(Path(settings.temp_dir) / f"sub_{uuid.uuid4().hex[:8]}.mp4")

        srt_path = video_path.replace(".mp4", ".srt")
        if srt_path == video_path:
            srt_path = str(Path(settings.temp_dir) / f"sub_{uuid.uuid4().hex[:8]}.srt")

        self._generate_srt(srt_path, segments)

        cmd = [
            "ffmpeg", "-y",
            "-i", video_path,
            "-vf",
            f"subtitles={srt_path}:force_style='"
            "FontName=Arial,FontSize=24,PrimaryColour=&HFFFFFF&,"
            "OutlineColour=&H000000&,Outline=3,Shadow=1,"
            "Alignment=2,MarginV=100,Bold=1'",
            "-c:a", "copy",
            output,
        ]

        result = subprocess.run(cmd, capture_output=True, text=True, timeout=300)
        if result.returncode != 0:
            logger.warning("subtitle_failed", stderr=result.stderr[:300])
            return video_path
        return output

    def _generate_srt(self, path: str, segments: list[dict]) -> None:
        """Genera SRT a partir de los segmentos del storyboard."""
        lines = []
        current_time = 0.0

        for i, seg in enumerate(segments, 1):
            # Parsear time_range si existe (ej: "[0-3s]")
            time_range = seg.get("time_range", "")
            if time_range:
                start_s, end_s = self._parse_time_range(time_range)
            else:
                # Estimar duración basada en el texto visual
                visual = seg.get("visual", seg.get("text", ""))
                words = len(visual.split())
                duration = max(2.0, words / 2.5)
                start_s = current_time
                end_s = current_time + duration
                current_time = end_s

            text_overlay = seg.get("text_overlay", "")
            if text_overlay:
                lines.append(f"{i}")
                lines.append(f"{self._format_srt_time(start_s)} --> {self._format_srt_time(end_s)}")
                lines.append(text_overlay)
                lines.append("")

        with open(path, "w", encoding="utf-8") as f:
            f.write("\n".join(lines))

    def _parse_time_range(self, time_range: str) -> tuple[float, float]:
        """Parsea '[0-3s]' → (0.0, 3.0)."""
        cleaned = time_range.strip("[]s ")
        parts = cleaned.split("-")
        try:
            return float(parts[0]), float(parts[1])
        except (ValueError, IndexError):
            return 0.0, 3.0

    def _format_srt_time(self, seconds: float) -> str:
        h = int(seconds // 3600)
        m = int((seconds % 3600) // 60)
        s = int(seconds % 60)
        ms = int((seconds % 1) * 1000)
        return f"{h:02d}:{m:02d}:{s:02d},{ms:03d}"

    def _ffmpeg_copy(self, src: str, dst: str) -> None:
        """Copia un video sin re-encoding."""
        cmd = [
            "ffmpeg", "-y", "-i", src,
            "-c", "copy", "-movflags", "+faststart",
            dst,
        ]
        self._run_ffmpeg(cmd, "copy")

    def _run_ffmpeg(self, cmd: list[str], step: str) -> None:
        """Ejecuta FFmpeg y verifica el resultado."""
        logger.info("ffmpeg_running", step=step)
        result = subprocess.run(cmd, capture_output=True, text=True, timeout=300)
        if result.returncode != 0:
            logger.error("ffmpeg_failed", step=step, stderr=result.stderr[:500])
            raise RuntimeError(f"FFmpeg falló en {step}: {result.stderr[:500]}")
