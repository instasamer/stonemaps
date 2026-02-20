import json

import anthropic
import structlog
from pydantic import BaseModel

from src.config.settings import settings
from src.scraper.models import ProductData

logger = structlog.get_logger()


class UGCScriptSegment(BaseModel):
    """Un segmento del guion con tipo y texto."""

    type: str  # "hook", "problem", "solution", "demo", "social_proof", "cta"
    text: str
    visual_note: str = ""  # Indicaciones visuales para el compositor


class UGCScript(BaseModel):
    """Guion completo de UGC generado."""

    product_name: str
    language: str
    tone: str  # "casual", "energetic", "professional", "relatable"
    duration_seconds: int
    segments: list[UGCScriptSegment]
    hashtags: list[str] = []

    @property
    def full_text(self) -> str:
        return " ".join(s.text for s in self.segments)


SYSTEM_PROMPT = """Eres un experto creador de contenido UGC (User Generated Content) para redes sociales.
Tu trabajo es escribir guiones para videos cortos estilo TikTok/Reels/Shorts que promocionen productos.

REGLAS:
- El guion debe sonar NATURAL, como si alguien estuviera hablando a cámara de forma espontánea
- Usa lenguaje coloquial, no corporativo
- El video completo debe durar entre 30-60 segundos
- Estructura: Hook → Problema → Solución (el producto) → Demo/Features → Social proof → CTA
- Incluye indicaciones visuales para cada segmento (qué se muestra en pantalla)
- El hook debe ser irresistible en los primeros 3 segundos

RESPONDE SIEMPRE EN JSON con este formato exacto:
{
    "product_name": "nombre corto del producto",
    "tone": "casual|energetic|professional|relatable",
    "duration_seconds": 45,
    "segments": [
        {
            "type": "hook",
            "text": "texto que dice el creador",
            "visual_note": "qué se muestra en pantalla"
        }
    ],
    "hashtags": ["#hashtag1", "#hashtag2"]
}"""


async def generate_ugc_script(
    product: ProductData,
    language: str = "es",
    tone: str = "casual",
    target_duration: int = 45,
) -> UGCScript:
    """Genera un guion UGC usando Claude a partir de los datos del producto."""
    logger.info(
        "generating_script",
        product=product.title,
        language=language,
        tone=tone,
    )

    client = anthropic.AsyncAnthropic(api_key=settings.anthropic_api_key)

    product_context = _build_product_context(product)

    user_prompt = f"""Genera un guion UGC para este producto:

{product_context}

CONFIGURACIÓN:
- Idioma: {language}
- Tono: {tone}
- Duración objetivo: {target_duration} segundos
- Plataforma: TikTok/Instagram Reels (formato vertical 9:16)

Escribe el guion completo en JSON."""

    message = await client.messages.create(
        model="claude-sonnet-4-20250514",
        max_tokens=2000,
        system=SYSTEM_PROMPT,
        messages=[{"role": "user", "content": user_prompt}],
    )

    response_text = message.content[0].text

    # Extraer JSON de la respuesta
    script_data = _parse_script_response(response_text)
    script_data["language"] = language

    return UGCScript(**script_data)


def _build_product_context(product: ProductData) -> str:
    """Construye el contexto del producto para el prompt."""
    parts = [
        f"PRODUCTO: {product.title}",
        f"PRECIO: {product.price} {product.currency}",
        f"MARKETPLACE: {product.marketplace}",
    ]

    if product.rating:
        parts.append(f"RATING: {product.rating}/5 ({product.review_count} reviews)")

    if product.features:
        parts.append("CARACTERÍSTICAS:")
        for f in product.features[:8]:
            parts.append(f"  - {f}")

    if product.description:
        desc = product.description[:500]
        parts.append(f"DESCRIPCIÓN: {desc}")

    if product.reviews_summary:
        parts.append("REVIEWS DESTACADAS:")
        for r in product.reviews_summary[:3]:
            parts.append(f"  - \"{r}\"")

    return "\n".join(parts)


def _parse_script_response(text: str) -> dict:
    """Extrae y parsea el JSON del response de Claude."""
    # Intentar parsear directamente
    try:
        return json.loads(text)
    except json.JSONDecodeError:
        pass

    # Buscar bloque JSON en la respuesta
    start = text.find("{")
    end = text.rfind("}") + 1
    if start >= 0 and end > start:
        try:
            return json.loads(text[start:end])
        except json.JSONDecodeError:
            pass

    raise ValueError(f"No se pudo parsear el guion de la respuesta: {text[:200]}")
