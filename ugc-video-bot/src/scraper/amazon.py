import structlog
from playwright.async_api import async_playwright

from .base import BaseScraper
from .models import ProductData

logger = structlog.get_logger()


class AmazonScraper(BaseScraper):
    marketplace = "amazon"

    async def scrape(self, url: str) -> ProductData:
        logger.info("scraping_amazon", url=url)

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

            await page.goto(url, wait_until="domcontentloaded", timeout=30000)
            await page.wait_for_timeout(2000)

            title = await self._extract_text(page, "#productTitle")
            price = await self._extract_price(page)
            description = await self._extract_description(page)
            images = await self._extract_images(page)
            features = await self._extract_features(page)
            rating = await self._extract_rating(page)
            review_count = await self._extract_review_count(page)

            await browser.close()

        return ProductData(
            url=url,
            marketplace=self.marketplace,
            title=title,
            description=description,
            price=price,
            currency="USD",
            rating=rating,
            review_count=review_count,
            images=images,
            features=features,
        )

    async def _extract_text(self, page, selector: str) -> str:
        el = await page.query_selector(selector)
        if el:
            text = await el.inner_text()
            return text.strip()
        return ""

    async def _extract_price(self, page) -> str:
        for selector in [
            ".a-price .a-offscreen",
            "#priceblock_ourprice",
            "#priceblock_dealprice",
            ".a-price-whole",
        ]:
            price = await self._extract_text(page, selector)
            if price:
                return price
        return "N/A"

    async def _extract_description(self, page) -> str:
        desc = await self._extract_text(page, "#productDescription")
        if not desc:
            desc = await self._extract_text(page, "#feature-bullets")
        return desc

    async def _extract_images(self, page) -> list[str]:
        images = []
        elements = await page.query_selector_all("#altImages img, #imgTagWrapperId img")
        for el in elements:
            src = await el.get_attribute("src")
            if src and "sprite" not in src and src.startswith("http"):
                # Intentar obtener la versión de alta resolución
                hi_res = src.replace("._AC_US40_", "._AC_SL1500_")
                hi_res = hi_res.replace("._AC_US100_", "._AC_SL1500_")
                images.append(hi_res)
        return images[:6]

    async def _extract_features(self, page) -> list[str]:
        features = []
        elements = await page.query_selector_all("#feature-bullets li span.a-list-item")
        for el in elements:
            text = await el.inner_text()
            text = text.strip()
            if text and len(text) > 5:
                features.append(text)
        return features

    async def _extract_rating(self, page) -> float | None:
        text = await self._extract_text(page, "#acrPopover .a-icon-alt")
        if text:
            try:
                return float(text.split(" ")[0])
            except (ValueError, IndexError):
                pass
        return None

    async def _extract_review_count(self, page) -> int | None:
        text = await self._extract_text(page, "#acrCustomerReviewText")
        if text:
            try:
                return int(text.replace(",", "").replace(".", "").split(" ")[0])
            except (ValueError, IndexError):
                pass
        return None
