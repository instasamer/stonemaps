import json

import structlog
from playwright.async_api import async_playwright

from .base import BaseScraper
from .models import ProductData

logger = structlog.get_logger()


class AliExpressScraper(BaseScraper):
    marketplace = "aliexpress"

    async def scrape(self, url: str) -> ProductData:
        logger.info("scraping_aliexpress", url=url)

        async with async_playwright() as p:
            browser = await p.chromium.launch(headless=True)
            context = await browser.new_context(
                user_agent=(
                    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
                    "AppleWebKit/537.36 (KHTML, like Gecko) "
                    "Chrome/120.0.0.0 Safari/537.36"
                ),
                locale="en-US",
            )
            page = await context.new_page()

            # AliExpress carga datos en un JSON embebido
            product_data = {}
            page.on(
                "response",
                lambda response: self._capture_api_response(response, product_data),
            )

            await page.goto(url, wait_until="domcontentloaded", timeout=30000)
            await page.wait_for_timeout(3000)

            # Intentar extraer datos del JSON embebido en la página
            if not product_data:
                product_data = await self._extract_from_page_scripts(page)

            # Fallback: extraer del DOM directamente
            title = product_data.get("title", "")
            if not title:
                title = await self._extract_text(page, "h1[data-pl='product-title']")
                if not title:
                    title = await self._extract_text(page, ".product-title-text")

            price = product_data.get("price", "")
            if not price:
                price = await self._extract_text(page, ".uniform-banner-box-price")
                if not price:
                    price = await self._extract_text(page, ".product-price-current")

            description = product_data.get("description", "")
            images = product_data.get("images", [])
            if not images:
                images = await self._extract_images(page)

            features = product_data.get("features", [])

            await browser.close()

        return ProductData(
            url=url,
            marketplace=self.marketplace,
            title=title,
            description=description,
            price=price,
            currency="USD",
            images=images,
            features=features,
        )

    async def _capture_api_response(self, response, data: dict):
        """Captura respuestas de la API interna de AliExpress."""
        url = response.url
        if "api/products" in url or "aeglobal" in url:
            try:
                body = await response.json()
                if isinstance(body, dict):
                    data.update(body)
            except Exception:
                pass

    async def _extract_from_page_scripts(self, page) -> dict:
        """Extrae datos del producto de los scripts embebidos en la página."""
        try:
            result = await page.evaluate("""
                () => {
                    const scripts = document.querySelectorAll('script');
                    for (const script of scripts) {
                        const text = script.textContent || '';
                        if (text.includes('window.runParams')) {
                            const match = text.match(/data:\\s*({[\\s\\S]*?})\\s*[,;]/);
                            if (match) {
                                try {
                                    return JSON.parse(match[1]);
                                } catch(e) {}
                            }
                        }
                    }
                    return {};
                }
            """)
            if result:
                return self._normalize_aliexpress_data(result)
        except Exception as e:
            logger.warning("aliexpress_script_extraction_failed", error=str(e))
        return {}

    def _normalize_aliexpress_data(self, raw: dict) -> dict:
        """Normaliza los datos crudos de AliExpress a un formato consistente."""
        data = {}

        # Título
        if "titleModule" in raw:
            data["title"] = raw["titleModule"].get("subject", "")

        # Precio
        if "priceModule" in raw:
            price_info = raw["priceModule"]
            data["price"] = price_info.get("formatedActivityPrice", "")
            if not data["price"]:
                data["price"] = price_info.get("formatedPrice", "")

        # Imágenes
        if "imageModule" in raw:
            data["images"] = raw["imageModule"].get("imagePathList", [])

        # Descripción
        if "descriptionModule" in raw:
            data["description"] = raw["descriptionModule"].get("descriptionUrl", "")

        # Features/specs
        if "specsModule" in raw:
            specs = raw["specsModule"].get("props", [])
            data["features"] = [
                f"{s.get('attrName', '')}: {s.get('attrValue', '')}" for s in specs
            ]

        return data

    async def _extract_text(self, page, selector: str) -> str:
        el = await page.query_selector(selector)
        if el:
            text = await el.inner_text()
            return text.strip()
        return ""

    async def _extract_images(self, page) -> list[str]:
        images = []
        elements = await page.query_selector_all(
            ".images-view-item img, .image-view-magnifier-wrap img"
        )
        for el in elements:
            src = await el.get_attribute("src")
            if src and src.startswith("http"):
                images.append(src)
        return images[:6]
