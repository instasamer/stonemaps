"""Servidor HTTP para el GPU Pod.

Expone endpoints para:
  - POST /v1/tts -- Text-to-Speech (Fish Speech)
  - POST /v1/i2v -- Image-to-Video (Wan2.2-I2V)
  - GET /health

Corre en el GPU pod (RunPod) con una RTX 5090.
"""

import io
import os
import uuid
from pathlib import Path

import torch
import uvicorn
from fastapi import FastAPI, File, Form, Header, HTTPException, UploadFile
from fastapi.responses import FileResponse

app = FastAPI(title="UGC Bot GPU Server")

MODELS_DIR = Path(os.getenv("MODELS_DIR", "/models"))
TEMP_DIR = Path(os.getenv("TEMP_DIR", "/data/tmp"))
API_KEY = os.getenv("API_KEY", "")

# Lazy-loaded models
_tts_model = None
_i2v_pipeline = None


def _check_auth(authorization: str = Header("")):
    if API_KEY and not authorization.endswith(API_KEY):
        raise HTTPException(status_code=401, detail="Unauthorized")


@app.get("/health")
async def health():
    gpu_available = torch.cuda.is_available()
    gpu_name = torch.cuda.get_device_name(0) if gpu_available else "none"
    return {
        "status": "ok",
        "gpu": gpu_name,
        "gpu_available": gpu_available,
        "vram_gb": round(torch.cuda.get_device_properties(0).total_mem / 1e9, 1)
        if gpu_available
        else 0,
    }


@app.post("/v1/tts")
async def tts(
    text: str = Form(...),
    voice_id: str = Form("neutral_female_es"),
    language: str = Form("es"),
    speed: float = Form(1.0),
    emotion: str = Form("neutral"),
    format: str = Form("wav"),
    authorization: str = Header(""),
):
    """Genera audio TTS usando Fish Speech."""
    _check_auth(authorization)

    global _tts_model
    if _tts_model is None:
        _tts_model = _load_tts_model()

    output_path = TEMP_DIR / f"tts_{uuid.uuid4().hex[:8]}.{format}"

    # TODO: Implementar la llamada real a Fish Speech
    # La API de Fish Speech varía según la versión instalada.
    # Esto es el esqueleto -- adaptar a la versión de Fish Speech que uses.
    #
    # Ejemplo con fish_speech:
    #   from fish_speech.inference import synthesize
    #   audio = synthesize(text=text, speaker=voice_id, speed=speed)
    #   torchaudio.save(str(output_path), audio, 24000)

    raise HTTPException(
        status_code=501,
        detail="TTS no implementado aún. Instalar Fish Speech y configurar modelo.",
    )

    return FileResponse(str(output_path), media_type=f"audio/{format}")


@app.post("/v1/i2v")
async def image_to_video(
    image: UploadFile = File(...),
    prompt: str = Form("Smooth slow zoom in on product"),
    duration: float = Form(5.0),
    fps: int = Form(24),
    authorization: str = Header(""),
):
    """Genera video a partir de imagen usando Wan2.2-I2V."""
    _check_auth(authorization)

    global _i2v_pipeline
    if _i2v_pipeline is None:
        _i2v_pipeline = _load_i2v_pipeline()

    # Leer imagen
    image_data = await image.read()
    output_path = TEMP_DIR / f"i2v_{uuid.uuid4().hex[:8]}.mp4"

    # TODO: Implementar la llamada real a Wan2.2-I2V
    # Esqueleto con diffusers:
    #
    # from diffusers.utils import load_image
    # from PIL import Image
    #
    # img = Image.open(io.BytesIO(image_data))
    # result = _i2v_pipeline(
    #     image=img,
    #     prompt=prompt,
    #     num_frames=int(duration * fps),
    #     fps=fps,
    # )
    # export_to_video(result.frames[0], str(output_path), fps=fps)

    raise HTTPException(
        status_code=501,
        detail="I2V no implementado aún. Descargar Wan2.2-I2V y configurar pipeline.",
    )

    return FileResponse(str(output_path), media_type="video/mp4")


def _load_tts_model():
    """Carga el modelo de TTS (Fish Speech)."""
    model_path = MODELS_DIR / "fish-speech-v1.5"
    if not model_path.exists():
        raise RuntimeError(
            f"Modelo TTS no encontrado en {model_path}. "
            "Descarga Fish Speech v1.5 al volumen del pod."
        )
    # TODO: Cargar modelo real
    return None


def _load_i2v_pipeline():
    """Carga el pipeline de Image-to-Video (Wan2.2-I2V)."""
    model_path = MODELS_DIR / "wan2.2-i2v"
    if not model_path.exists():
        raise RuntimeError(
            f"Modelo I2V no encontrado en {model_path}. "
            "Descarga Wan2.2-I2V al volumen del pod."
        )
    # TODO: Cargar pipeline real con diffusers
    # from diffusers import WanPipeline
    # return WanPipeline.from_pretrained(str(model_path), torch_dtype=torch.float16).to("cuda")
    return None


if __name__ == "__main__":
    TEMP_DIR.mkdir(parents=True, exist_ok=True)
    uvicorn.run(app, host="0.0.0.0", port=50051)
