import abc

import structlog

from .models import ProductData

logger = structlog.get_logger()


class BaseScraper(abc.ABC):
    """Clase base para scrapers de marketplace."""

    marketplace: str = ""

    @abc.abstractmethod
    async def scrape(self, url: str) -> ProductData:
        """Extrae datos del producto desde la URL."""
        ...

    async def _download_image(self, url: str, dest_path: str) -> str:
        """Descarga una imagen y retorna el path local."""
        import httpx

        async with httpx.AsyncClient() as client:
            resp = await client.get(url, follow_redirects=True)
            resp.raise_for_status()
            with open(dest_path, "wb") as f:
                f.write(resp.content)
        return dest_path
