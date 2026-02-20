from urllib.parse import urlparse

import structlog

from .aliexpress import AliExpressScraper
from .amazon import AmazonScraper
from .models import ProductData

logger = structlog.get_logger()

SCRAPERS = {
    "amazon": AmazonScraper(),
    "aliexpress": AliExpressScraper(),
}


def detect_marketplace(url: str) -> str:
    """Detecta el marketplace a partir de la URL."""
    hostname = urlparse(url).hostname or ""
    hostname = hostname.lower()

    if "amazon" in hostname:
        return "amazon"
    elif "aliexpress" in hostname:
        return "aliexpress"
    else:
        raise ValueError(f"Marketplace no soportado para URL: {url}")


async def scrape_product(url: str) -> ProductData:
    """Scraper universal: detecta el marketplace y extrae el producto."""
    marketplace = detect_marketplace(url)
    scraper = SCRAPERS.get(marketplace)
    if not scraper:
        raise ValueError(f"No hay scraper para: {marketplace}")

    logger.info("scraping_product", marketplace=marketplace, url=url)
    return await scraper.scrape(url)
