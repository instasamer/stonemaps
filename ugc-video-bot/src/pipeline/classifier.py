"""Clasifica el tipo de producto y sugiere estilos de video UGC."""

import json

import anthropic
import structlog

from src.config.settings import settings
from src.scraper.models import ProductData

from . import StyleSuggestion, VideoStyle, VIDEO_STYLE_LABELS

logger = structlog.get_logger()

CLASSIFIER_PROMPT = """Eres un experto en UGC (User Generated Content) para redes sociales.

Dado un producto de marketplace, debes sugerir los 3 mejores estilos de video UGC para promocionarlo.

ESTILOS DISPONIBLES:
- uso: Demo de uso / Cómo funciona (ideal para herramientas, gadgets, productos funcionales)
- decoracion: Ambientación lifestyle / Decoración (ideal para productos estéticos, decorativos, hogar)
- features: Showcase de características (ideal para productos con múltiples funciones o specs)
- unboxing: Revelación / Unboxing (ideal para productos premium, con buen packaging)
- antes_despues: Antes y después / Transformación (ideal para productos de limpieza, belleza, mejora)
- comparacion: Comparación con alternativas (ideal para productos con ventaja competitiva clara)

RESPONDE en JSON con exactamente 3 sugerencias ordenadas de mejor a peor:
[
    {
        "style": "uso",
        "reason": "razón breve de por qué este estilo funciona",
        "confidence": 0.9
    }
]"""


async def classify_product_styles(product: ProductData) -> list[StyleSuggestion]:
    """Analiza el producto y sugiere estilos de video apropiados."""
    logger.info("classifying_product", product=product.title)

    client = anthropic.AsyncAnthropic(api_key=settings.anthropic_api_key)

    product_summary = (
        f"Producto: {product.title}\n"
        f"Precio: {product.price} {product.currency}\n"
        f"Categoría/Marketplace: {product.marketplace}\n"
    )
    if product.features:
        product_summary += "Características:\n"
        for f in product.features[:6]:
            product_summary += f"  - {f}\n"
    if product.description:
        product_summary += f"Descripción: {product.description[:300]}\n"
    if product.rating:
        product_summary += f"Rating: {product.rating}/5 ({product.review_count} reviews)\n"

    message = await client.messages.create(
        model="claude-haiku-4-5-20251001",
        max_tokens=500,
        system=CLASSIFIER_PROMPT,
        messages=[{"role": "user", "content": product_summary}],
    )

    response_text = message.content[0].text
    suggestions_raw = _parse_json_response(response_text)

    suggestions = []
    for s in suggestions_raw[:3]:
        style = VideoStyle(s["style"])
        suggestions.append(
            StyleSuggestion(
                style=style,
                label=VIDEO_STYLE_LABELS[style],
                reason=s["reason"],
                confidence=s.get("confidence", 0.5),
            )
        )

    logger.info("classification_done", suggestions=[s.style for s in suggestions])
    return suggestions


def _parse_json_response(text: str) -> list[dict]:
    try:
        return json.loads(text)
    except json.JSONDecodeError:
        start = text.find("[")
        end = text.rfind("]") + 1
        if start >= 0 and end > start:
            return json.loads(text[start:end])
    raise ValueError(f"No se pudo parsear la clasificación: {text[:200]}")
