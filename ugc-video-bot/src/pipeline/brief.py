"""Genera el creative brief / storyboard para aprobación del usuario."""

import json

import anthropic
import structlog

from src.config.settings import settings
from src.scraper.models import ProductData

from . import (
    CreativeBrief,
    StoryboardSegment,
    VideoDuration,
    VideoFormat,
    VideoStyle,
    VIDEO_STYLE_LABELS,
)

logger = structlog.get_logger()

BRIEF_PROMPT = """Eres un director creativo especializado en videos UGC (User Generated Content) para redes sociales.

Tu trabajo es crear un STORYBOARD detallado y un GUION DE VOZ EN OFF para un video de producto.

IMPORTANTE:
- NO aparecen personas/caras en el video. Solo manos, producto, y entorno.
- El estilo es "producto en contexto" / "manos usando producto" / "aesthetic showcase"
- El guion de voz en off debe sonar natural, como alguien compartiendo un descubrimiento
- Cada segmento del storyboard debe tener: rango de tiempo, descripción visual, movimiento de cámara
- Adapta el número de segmentos a la duración del video
- El primer segmento SIEMPRE debe ser un hook visual impactante (3 segundos max)
- El último segmento debe tener CTA o cierre

RESPONDE en JSON con este formato exacto:
{
    "storyboard": [
        {
            "time_range": "[0-3s]",
            "visual": "Descripción de lo que se ve en pantalla",
            "camera": "Movimiento de cámara (zoom in, paneo, cenital, slider...)",
            "text_overlay": "Texto en pantalla si aplica (vacío si no)"
        }
    ],
    "voiceover_script": "El guion completo de voz en off, natural y conversacional",
    "music_mood": "chill|upbeat|dramatic|minimal|cozy|energetic",
    "color_palette": "Descripción breve del mood visual (ej: tonos cálidos, minimalista blanco...)",
    "summary": "Resumen de 1-2 líneas del concepto creativo"
}"""


async def generate_creative_brief(
    product: ProductData,
    style: VideoStyle,
    format: VideoFormat,
    duration: VideoDuration,
    language: str = "es",
) -> CreativeBrief:
    """Genera un creative brief completo para aprobación."""
    logger.info(
        "generating_brief",
        product=product.title,
        style=style,
        format=format,
        duration=duration,
    )

    client = anthropic.AsyncAnthropic(api_key=settings.anthropic_api_key)

    user_prompt = f"""Crea un storyboard para este video UGC:

PRODUCTO: {product.title}
PRECIO: {product.price} {product.currency}
MARKETPLACE: {product.marketplace}
"""
    if product.features:
        user_prompt += "CARACTERÍSTICAS:\n"
        for f in product.features[:6]:
            user_prompt += f"  - {f}\n"
    if product.description:
        user_prompt += f"DESCRIPCIÓN: {product.description[:400]}\n"
    if product.rating:
        user_prompt += f"RATING: {product.rating}/5 ({product.review_count} reviews)\n"

    user_prompt += f"""
CONFIGURACIÓN DEL VIDEO:
- Estilo: {style.value} ({VIDEO_STYLE_LABELS[style]})
- Formato: {format.value}
- Duración: {duration.value} segundos
- Idioma del voiceover: {language}
- SIN personas/caras, solo manos y producto
"""

    message = await client.messages.create(
        model="claude-sonnet-4-20250514",
        max_tokens=2000,
        system=BRIEF_PROMPT,
        messages=[{"role": "user", "content": user_prompt}],
    )

    response_text = message.content[0].text
    brief_data = _parse_json_response(response_text)

    storyboard = [StoryboardSegment(**seg) for seg in brief_data["storyboard"]]

    brief = CreativeBrief(
        style=style,
        format=format,
        duration=duration,
        storyboard=storyboard,
        voiceover_script=brief_data["voiceover_script"],
        music_mood=brief_data.get("music_mood", "chill"),
        color_palette=brief_data.get("color_palette", ""),
        summary=brief_data.get("summary", ""),
    )

    logger.info("brief_generated", segments=len(storyboard))
    return brief


def _parse_json_response(text: str) -> dict:
    try:
        return json.loads(text)
    except json.JSONDecodeError:
        start = text.find("{")
        end = text.rfind("}") + 1
        if start >= 0 and end > start:
            return json.loads(text[start:end])
    raise ValueError(f"No se pudo parsear el brief: {text[:200]}")
