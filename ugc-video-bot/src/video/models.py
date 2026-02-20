from pydantic import BaseModel


class VideoRequest(BaseModel):
    """Request para generar video de talking head."""

    avatar_image_path: str  # Path a la imagen del avatar
    audio_path: str  # Path al audio TTS
    resolution: str = "1080x1920"  # Vertical 9:16
    fps: int = 24


class VideoResult(BaseModel):
    """Resultado de la generación de video."""

    video_path: str
    duration_seconds: float
    resolution: str
    fps: int


class CompositionConfig(BaseModel):
    """Configuración para la composición del video final."""

    talking_head_path: str
    product_images: list[str] = []  # Paths a imágenes del producto
    product_name: str = ""
    segments: list[dict] = []  # Segmentos del guion con visual_notes
    output_path: str = ""
    resolution: tuple[int, int] = (1080, 1920)  # width, height (9:16)
    fps: int = 24
    add_subtitles: bool = True
    add_product_overlay: bool = True
