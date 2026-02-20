# UGC Video Bot

Bot que genera videos de producto estilo UGC a partir de un enlace de Amazon.
Sin personas/caras -- solo producto, manos, aesthetic. Controlado via ClawBot (Telegram).

## Arquitectura

```
Tú (Telegram) → ClawBot → ugc-bot CLI → Video

[URL de Amazon]
       │
       ▼
┌──────────────┐
│   SCRAPER    │  ← Playwright: título, precio, imágenes, features, reviews
└──────┬───────┘
       │
       ▼
┌──────────────┐
│  CLASSIFIER  │  ← Claude (Haiku): sugiere estilos de video
│  + BRIEFING  │  ← Claude (Sonnet): genera storyboard + guion voz en off
└──────┬───────┘
       │
       ├────────────────────────┐
       ▼                        ▼
┌──────────────┐        ┌──────────────┐
│     TTS      │        │   IMAGE →    │
│  (Voz en off)│        │    VIDEO     │  ← Fotos del producto → clips con movimiento
│  Fish Speech │        │  Wan2.2-I2V  │
│  🔥 GPU Pod  │        │  🔥 GPU Pod  │
└──────┬───────┘        └──────┬───────┘
       │                       │
       ▼                       ▼
┌─────────────────────────────────────┐
│         COMPOSITOR (FFmpeg)          │
│  Clips + voz en off + subtítulos    │
└──────────────┬──────────────────────┘
               ▼
        [Video UGC final]
```

## Flujo interactivo (3 pasos)

```bash
# 1. Analizar producto → sugiere estilos
ugc-bot analyze "https://amazon.com/dp/XXXXX"

# 2. Generar storyboard para aprobación
ugc-bot preview --job abc123 --style decoracion --format 9:16 --duration 30

# 3. Generar video (enciende GPU pod, genera, apaga)
ugc-bot generate --job abc123
```

## Stack

| Componente | Tecnología | Dónde corre |
|---|---|---|
| CLI / Orquestador | Python + argparse | VPS (Docker) |
| Scraping | Playwright | VPS |
| Clasificación + Briefing | Claude API (Haiku + Sonnet) | VPS (API call) |
| Text-to-Speech | Fish Speech v1.5 | GPU Pod (5090, RunPod) |
| Image-to-Video | Wan2.2-I2V | GPU Pod (5090, RunPod) |
| Composición | FFmpeg | VPS |
| Interfaz | ClawBot (Telegram) | VPS |

## Setup

```bash
# Docker (recomendado para ClawBot)
docker build -t ugc-bot .
cp .env.example .env  # Editar con tus claves
docker run --rm --env-file .env -v ugc-data:/data ugc-bot analyze "URL"

# Local dev
pip install -e ".[dev]"
playwright install chromium
ugc-bot analyze "URL"
```

## Estructura

```
ugc-video-bot/
├── src/
│   ├── cli.py          # CLI principal (lo que ClawBot ejecuta)
│   ├── scraper/        # Scraping de Amazon
│   ├── scriptgen/      # Generación de guiones (legacy, ahora en pipeline/)
│   ├── tts/            # Cliente TTS → GPU pod
│   ├── video/          # Compositor FFmpeg
│   ├── pipeline/       # Orquestador, clasificador, briefing, jobs, GPU pod
│   └── config/         # Settings (Pydantic)
├── docker/
│   └── gpu-pod/        # Docker image para RunPod (TTS + I2V)
├── Dockerfile          # Docker image del bot (VPS)
├── CLAWBOT.md          # Instrucciones para ClawBot
├── pyproject.toml
└── .env.example
```

Ver [CLAWBOT.md](CLAWBOT.md) para instrucciones detalladas de uso con ClawBot.
