from pydantic import BaseModel


class ProductData(BaseModel):
    """Datos extraídos de un producto del marketplace."""

    url: str
    marketplace: str  # "amazon", "aliexpress", etc.
    title: str
    description: str
    price: str
    currency: str = "USD"
    rating: float | None = None
    review_count: int | None = None
    images: list[str] = []  # URLs de imágenes del producto
    features: list[str] = []  # Bullet points / características
    reviews_summary: list[str] = []  # Mejores reviews resumidas
