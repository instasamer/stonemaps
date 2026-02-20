FROM python:3.12-slim

# FFmpeg para composición de video
RUN apt-get update && apt-get install -y --no-install-recommends \
    ffmpeg \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Instalar dependencias
COPY pyproject.toml .
RUN pip install --no-cache-dir -e .

# Instalar Playwright + Chromium para scraping
RUN playwright install --with-deps chromium

# Copiar código
COPY src/ src/

# Crear directorios de datos
RUN mkdir -p /data/outputs /data/tmp /data/tmp/jobs

ENV PYTHONUNBUFFERED=1
ENV OUTPUT_DIR=/data/outputs
ENV TEMP_DIR=/data/tmp

ENTRYPOINT ["ugc-bot"]
