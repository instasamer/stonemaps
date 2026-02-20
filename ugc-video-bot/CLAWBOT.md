# UGC Video Bot - Instrucciones para ClawBot

## Qué es

Bot que genera videos UGC de producto (sin personas, estilo manos/producto/aesthetic) a partir de un enlace de Amazon.

## Instalación

```bash
cd /opt/ugc-video-bot
docker build -t ugc-bot .
```

## Cómo usarlo

El flujo tiene 3 pasos. Cuando el usuario envíe un enlace de Amazon, sigue estos pasos:

### Paso 1: Analizar producto

```bash
docker run --rm --env-file .env -v ugc-data:/data ugc-bot analyze "URL_DEL_PRODUCTO"
```

Esto devuelve:
- Info del producto (nombre, precio, rating)
- 3 estilos de video sugeridos
- Formatos y duraciones disponibles
- Un **Job ID** que se usa en los siguientes pasos

**Presenta las opciones al usuario y espera su elección.**

### Paso 2: Preview / Storyboard

```bash
docker run --rm --env-file .env -v ugc-data:/data ugc-bot preview \
    --job JOB_ID \
    --style ESTILO \
    --format FORMATO \
    --duration DURACION
```

Valores válidos:
- `--style`: `uso`, `decoracion`, `features`, `unboxing`, `antes_despues`, `comparacion`
- `--format`: `9:16` (TikTok/Reels), `1:1` (Instagram), `16:9` (YouTube)
- `--duration`: `15`, `30`, `45`, `60`

Esto devuelve un storyboard detallado y guion de voz en off.

**Presenta el storyboard al usuario y pregunta si aprueba, quiere regenerar, o quiere editar.**

### Paso 3: Generar video

```bash
docker run --rm --env-file .env -v ugc-data:/data ugc-bot generate --job JOB_ID
```

Esto:
1. Enciende el GPU pod (RunPod)
2. Genera la voz en off (TTS)
3. Genera clips de producto (Image-to-Video)
4. Compone el video final con FFmpeg
5. Apaga el GPU pod

El video final queda en `/data/outputs/`. Envíalo al usuario.

### Otros comandos

```bash
# Ver estado de un job
docker run --rm --env-file .env -v ugc-data:/data ugc-bot status --job JOB_ID

# Listar jobs recientes
docker run --rm --env-file .env -v ugc-data:/data ugc-bot list
```

## Ejemplo de conversación

```
Usuario: genera un video de https://amazon.com/dp/B0XXXXX
ClawBot: [ejecuta analyze]
         📦 Lámpara LED Sunset - $24.99 ⭐4.7
         🎬 Te sugiero estos estilos:
         1. decoracion - Ambientación lifestyle
         2. features - Modos de luz
         3. uso - Cómo se usa
         ¿Cuál quieres? Formato y duración?

Usuario: decoracion, vertical, 30 segundos
ClawBot: [ejecuta preview]
         📋 STORYBOARD:
         [0-3s] Mesa de madera con lámpara apagada, cenital
         [3-8s] Se enciende, zoom in suave...
         ...
         🎙️ "Si buscabas ese toque aesthetic..."
         ¿Te mola? ¿Genero?

Usuario: dale
ClawBot: [ejecuta generate]
         ⏳ Generando... (2-5 min)
         ✅ Aquí tienes tu video [adjunta archivo]
```

## Variables de entorno necesarias (.env)

```
ANTHROPIC_API_KEY=sk-ant-...
GPU_POD_HOST=...
GPU_POD_PORT=50051
GPU_POD_API_KEY=...
```
