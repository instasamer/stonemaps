# UGC Video Bot

Bot automatizado que genera videos estilo UGC (User Generated Content) a partir de un enlace de marketplace.

## Arquitectura

```
[URL del producto]
       │
       ▼
┌──────────────┐
│   SCRAPER    │  ← Extrae info del producto (título, descripción, imágenes, precio, reviews)
│  (Playwright)│
└──────┬───────┘
       │
       ▼
┌──────────────┐
│  SCRIPTGEN   │  ← Genera guion UGC usando Claude API
│ (Claude API) │
└──────┬───────┘
       │
       ▼
┌──────────────┐
│     TTS      │  ← Genera voz natural a partir del guion
│(Fish Speech) │     🔥 GPU Pod (RTX 5090)
└──────┬───────┘
       │
       ▼
┌──────────────┐
│  VIDEO GEN   │  ← Genera talking head desde avatar + audio
│ (Wan2.2-S2V) │     🔥 GPU Pod (RTX 5090)
└──────┬───────┘
       │
       ▼
┌──────────────┐
│  COMPOSITOR  │  ← Compone video final: talking head + producto + texto
│   (FFmpeg)   │
└──────┬───────┘
       │
       ▼
[Video UGC final]
```

## Stack Tecnológico

| Componente | Tecnología | Ubicación |
|---|---|---|
| API/Orquestador | FastAPI + Celery + Redis | VPS |
| Scraping | Playwright + BeautifulSoup | VPS |
| Generación de guion | Claude API (Anthropic SDK) | VPS (API call) |
| Text-to-Speech | Fish Speech v1.5 | GPU Pod (5090) |
| Video Generation | Wan2.2-S2V | GPU Pod (5090) |
| Composición | FFmpeg + MoviePy | VPS |
| Base de datos | PostgreSQL (Supabase) | Cloud |
| Cola de tareas | Redis | VPS |
| Deployment | Docker Compose | VPS + GPU Pod |

## Requisitos

- Python 3.11+
- Redis (cola de tareas)
- FFmpeg (composición de video)
- GPU NVIDIA RTX 5090 (para TTS y generación de video)
- Claves API: Anthropic (Claude), Supabase

## Quickstart

```bash
# 1. Instalar dependencias
pip install -e ".[dev]"

# 2. Configurar variables de entorno
cp .env.example .env
# Editar .env con tus claves

# 3. Levantar servicios
docker compose up -d redis

# 4. Iniciar worker de Celery
celery -A src.pipeline.worker worker --loglevel=info

# 5. Iniciar API
uvicorn src.api.main:app --host 0.0.0.0 --port 8000
```

## Uso

```bash
# Generar video desde URL de producto
curl -X POST http://localhost:8000/api/v1/generate \
  -H "Content-Type: application/json" \
  -d '{"product_url": "https://www.amazon.com/dp/B0EXAMPLE", "avatar": "female_01", "language": "es"}'

# Consultar estado
curl http://localhost:8000/api/v1/status/{job_id}
```

## Estructura del Proyecto

```
ugc-video-bot/
├── src/
│   ├── api/           # FastAPI server
│   ├── scraper/       # Product scraping (Amazon, AliExpress, etc.)
│   ├── scriptgen/     # UGC script generation via Claude
│   ├── tts/           # Text-to-Speech (Fish Speech)
│   ├── video/         # Video generation (Wan2.2-S2V) + composición
│   ├── pipeline/      # Celery workers y orquestación
│   └── config/        # Configuración y settings
├── tests/
├── docker/
├── scripts/
├── pyproject.toml
├── docker-compose.yml
└── .env.example
```
