"""Orquestador principal del pipeline UGC.

Conecta los tres pasos: analyze → preview → generate
"""

import structlog

from src.scraper import scrape_product
from src.scraper.models import ProductData
from src.tts.client import TTSClient
from src.tts.models import TTSRequest
from src.video.compositor import VideoCompositor
from src.video.models import CompositionConfig

from . import (
    AnalysisResult,
    CreativeBrief,
    FORMAT_RESOLUTIONS,
    Job,
    JobStatus,
    VideoDuration,
    VideoFormat,
    VideoStyle,
)
from .brief import generate_creative_brief
from .classifier import classify_product_styles
from .gpu_pod import GPUPodManager
from .jobs import create_job, get_job, update_job

logger = structlog.get_logger()


async def step_analyze(product_url: str) -> AnalysisResult:
    """Paso 1: Analiza el producto y sugiere estilos."""
    # Scrape del producto
    product = await scrape_product(product_url)

    # Clasificar estilos sugeridos
    suggestions = await classify_product_styles(product)

    # Crear job
    job = create_job(product_url)
    job.product_data = product.model_dump()
    job.status = JobStatus.ANALYZED
    update_job(job)

    return AnalysisResult(
        job_id=job.id,
        product_name=product.title,
        product_price=f"{product.price} {product.currency}",
        product_rating=product.rating,
        product_review_count=product.review_count,
        product_image_count=len(product.images),
        suggested_styles=suggestions,
    )


async def step_preview(
    job_id: str,
    style: VideoStyle,
    format: VideoFormat,
    duration: VideoDuration,
    language: str = "es",
) -> CreativeBrief:
    """Paso 2: Genera creative brief para aprobación."""
    job = get_job(job_id)
    product = ProductData(**job.product_data)

    # Generar brief
    brief = await generate_creative_brief(product, style, format, duration, language)

    # Guardar elecciones en el job
    job.style = style
    job.format = format
    job.duration = duration
    job.creative_brief = brief
    job.status = JobStatus.PREVIEWED
    update_job(job)

    return brief


async def step_generate(job_id: str) -> str:
    """Paso 3: Genera el video final."""
    job = get_job(job_id)
    if job.status != JobStatus.PREVIEWED:
        raise ValueError(f"Job {job_id} no está en estado previewed (estado actual: {job.status})")

    job.status = JobStatus.GENERATING
    update_job(job)

    try:
        product = ProductData(**job.product_data)
        brief = job.creative_brief

        gpu = GPUPodManager()

        # 1. Encender GPU pod bajo demanda
        logger.info("starting_gpu_pod", job_id=job_id)
        pod_info = await gpu.ensure_running()
        logger.info("gpu_pod_ready", pod_id=pod_info.get("id", "unknown"))

        # 2. Generar TTS (voz en off)
        logger.info("generating_tts", job_id=job_id)
        tts_client = TTSClient()
        tts_result = await tts_client.generate(
            TTSRequest(
                text=brief.voiceover_script,
                language="es",
            )
        )

        # 3. Generar clips de producto via Image-to-Video
        logger.info("generating_i2v_clips", job_id=job_id)
        product_clips = await gpu.generate_i2v_clips(
            image_urls=product.images[:4],
            storyboard=[s.model_dump() for s in brief.storyboard],
            duration=brief.duration.value,
        )

        # 4. Componer video final
        logger.info("compositing_video", job_id=job_id)
        resolution = FORMAT_RESOLUTIONS[brief.format]
        compositor = VideoCompositor()
        output_path = await compositor.compose(
            CompositionConfig(
                talking_head_path="",  # No hay talking head
                product_images=[],  # Usamos clips en vez de imágenes estáticas
                product_name=product.title,
                segments=[s.model_dump() for s in brief.storyboard],
                resolution=resolution,
                fps=24,
                add_subtitles=True,
                add_product_overlay=False,
            ),
            audio_path=tts_result.audio_path,
            video_clips=product_clips,
        )

        # 5. Apagar GPU pod
        await gpu.stop_if_idle()

        job.output_path = output_path
        job.status = JobStatus.COMPLETED
        update_job(job)

        logger.info("generation_complete", job_id=job_id, output=output_path)
        return output_path

    except Exception as e:
        job.status = JobStatus.FAILED
        job.error = str(e)
        update_job(job)
        logger.error("generation_failed", job_id=job_id, error=str(e))
        raise
