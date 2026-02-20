"""Modelos del flujo de trabajo multi-paso del UGC bot."""

from enum import Enum
from datetime import datetime

from pydantic import BaseModel, Field


class VideoStyle(str, Enum):
    """Estilos de video UGC disponibles."""

    USO = "uso"  # Demo de uso / herramienta
    DECORACION = "decoracion"  # Lifestyle / ambientación
    FEATURES = "features"  # Showcase de características
    UNBOXING = "unboxing"  # Revelación del producto
    ANTES_DESPUES = "antes_despues"  # Transformación
    COMPARACION = "comparacion"  # vs alternativas


VIDEO_STYLE_LABELS = {
    VideoStyle.USO: "Demo de uso / Cómo funciona",
    VideoStyle.DECORACION: "Ambientación lifestyle / Decoración",
    VideoStyle.FEATURES: "Showcase de características",
    VideoStyle.UNBOXING: "Revelación / Unboxing",
    VideoStyle.ANTES_DESPUES: "Antes y después / Transformación",
    VideoStyle.COMPARACION: "Comparación con alternativas",
}


class VideoFormat(str, Enum):
    """Formatos de video disponibles."""

    VERTICAL = "9:16"  # TikTok, Reels, Shorts
    SQUARE = "1:1"  # Instagram feed
    HORIZONTAL = "16:9"  # YouTube

FORMAT_RESOLUTIONS = {
    VideoFormat.VERTICAL: (1080, 1920),
    VideoFormat.SQUARE: (1080, 1080),
    VideoFormat.HORIZONTAL: (1920, 1080),
}


class VideoDuration(int, Enum):
    """Duraciones disponibles en segundos."""

    ULTRA_SHORT = 15
    SHORT = 30
    MEDIUM = 45
    FULL = 60


class JobStatus(str, Enum):
    """Estados del job."""

    ANALYZED = "analyzed"  # Producto analizado, esperando elección de estilo
    PREVIEWED = "previewed"  # Preview/storyboard generado, esperando aprobación
    GENERATING = "generating"  # Video en generación
    COMPLETED = "completed"  # Video listo
    FAILED = "failed"


class StoryboardSegment(BaseModel):
    """Un segmento del storyboard."""

    time_range: str  # "[0-3s]"
    visual: str  # Descripción de lo que se ve
    camera: str = ""  # Movimiento de cámara (zoom in, paneo, cenital...)
    text_overlay: str = ""  # Texto en pantalla si aplica


class CreativeBrief(BaseModel):
    """Brief creativo / preview para aprobación del usuario."""

    style: VideoStyle
    format: VideoFormat
    duration: VideoDuration
    storyboard: list[StoryboardSegment]
    voiceover_script: str  # Guion de voz en off completo
    music_mood: str  # "chill", "upbeat", "dramatic", "minimal"
    color_palette: str  # Descripción del mood visual
    summary: str  # Resumen de 1-2 líneas del concepto


class StyleSuggestion(BaseModel):
    """Sugerencia de estilo para un producto."""

    style: VideoStyle
    label: str
    reason: str  # Por qué este estilo encaja con el producto
    confidence: float = 0.0  # 0-1


class AnalysisResult(BaseModel):
    """Resultado del análisis de producto (paso 1)."""

    job_id: str
    product_name: str
    product_price: str
    product_rating: float | None = None
    product_review_count: int | None = None
    product_image_count: int = 0
    suggested_styles: list[StyleSuggestion]
    available_formats: list[VideoFormat] = list(VideoFormat)
    available_durations: list[VideoDuration] = list(VideoDuration)


class Job(BaseModel):
    """Estado completo de un job de generación."""

    id: str
    status: JobStatus
    product_url: str
    created_at: datetime = Field(default_factory=datetime.now)

    # Datos del producto (set en analyze)
    product_data: dict = {}

    # Elecciones del usuario (set en preview)
    style: VideoStyle | None = None
    format: VideoFormat | None = None
    duration: VideoDuration | None = None

    # Creative brief (set en preview)
    creative_brief: CreativeBrief | None = None

    # Resultado (set en generate)
    output_path: str = ""
    error: str = ""
