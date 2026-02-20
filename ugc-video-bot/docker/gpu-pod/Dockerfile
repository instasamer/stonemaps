# Dockerfile para el GPU Pod (RunPod)
# Ejecuta Fish Speech (TTS) + Wan2.2-I2V (Image-to-Video)
#
# Este Dockerfile es un template -- los modelos se descargan
# al montar el volumen o en el primer boot.

FROM nvidia/cuda:12.4.0-devel-ubuntu22.04

ENV DEBIAN_FRONTEND=noninteractive
ENV PYTHONUNBUFFERED=1

RUN apt-get update && apt-get install -y --no-install-recommends \
    python3.11 python3.11-venv python3-pip \
    git wget ffmpeg \
    && rm -rf /var/lib/apt/lists/*

RUN ln -s /usr/bin/python3.11 /usr/bin/python

WORKDIR /app

# Dependencias Python para GPU
COPY requirements-gpu.txt .
RUN pip install --no-cache-dir -r requirements-gpu.txt

# Server que expone los endpoints de TTS e I2V
COPY gpu_server.py .

# Directorio para modelos (se monta como volumen en RunPod)
RUN mkdir -p /models /data/tmp

ENV MODELS_DIR=/models
ENV TEMP_DIR=/data/tmp

EXPOSE 50051

CMD ["python", "gpu_server.py"]
