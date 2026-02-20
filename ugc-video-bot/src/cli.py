"""CLI del UGC Video Bot.

Uso por ClawBot:
    ugc-bot analyze "https://amazon.com/dp/XXXXX"
    ugc-bot preview --job abc123 --style uso --format 9:16 --duration 30
    ugc-bot generate --job abc123
    ugc-bot status --job abc123
    ugc-bot list
"""

import argparse
import asyncio
import json
import sys

from src.pipeline import (
    AnalysisResult,
    CreativeBrief,
    JobStatus,
    VideoDuration,
    VideoFormat,
    VideoStyle,
    VIDEO_STYLE_LABELS,
)
from src.pipeline.orchestrator import step_analyze, step_preview, step_generate
from src.pipeline.jobs import get_job, list_jobs


def main():
    parser = argparse.ArgumentParser(
        prog="ugc-bot",
        description="UGC Video Bot - Genera videos de producto desde URLs de marketplace",
    )
    subparsers = parser.add_subparsers(dest="command", required=True)

    # === analyze ===
    p_analyze = subparsers.add_parser("analyze", help="Analiza un producto y sugiere estilos")
    p_analyze.add_argument("url", help="URL del producto (Amazon)")

    # === preview ===
    p_preview = subparsers.add_parser("preview", help="Genera storyboard para aprobación")
    p_preview.add_argument("--job", required=True, help="ID del job")
    p_preview.add_argument(
        "--style",
        required=True,
        choices=[s.value for s in VideoStyle],
        help="Estilo de video",
    )
    p_preview.add_argument(
        "--format",
        required=True,
        choices=[f.value for f in VideoFormat],
        help="Formato de video",
    )
    p_preview.add_argument(
        "--duration",
        required=True,
        type=int,
        choices=[d.value for d in VideoDuration],
        help="Duración en segundos",
    )
    p_preview.add_argument("--lang", default="es", help="Idioma del voiceover")

    # === generate ===
    p_generate = subparsers.add_parser("generate", help="Genera el video final (requiere preview aprobado)")
    p_generate.add_argument("--job", required=True, help="ID del job")

    # === status ===
    p_status = subparsers.add_parser("status", help="Consulta el estado de un job")
    p_status.add_argument("--job", required=True, help="ID del job")

    # === list ===
    subparsers.add_parser("list", help="Lista los jobs recientes")

    args = parser.parse_args()

    try:
        if args.command == "analyze":
            asyncio.run(_cmd_analyze(args.url))
        elif args.command == "preview":
            asyncio.run(
                _cmd_preview(
                    args.job,
                    VideoStyle(args.style),
                    VideoFormat(args.format),
                    VideoDuration(args.duration),
                    args.lang,
                )
            )
        elif args.command == "generate":
            asyncio.run(_cmd_generate(args.job))
        elif args.command == "status":
            _cmd_status(args.job)
        elif args.command == "list":
            _cmd_list()
    except Exception as e:
        print(f"\n❌ Error: {e}", file=sys.stderr)
        sys.exit(1)


async def _cmd_analyze(url: str):
    print(f"🔍 Analizando producto: {url}\n")
    result = await step_analyze(url)
    _print_analysis(result)


async def _cmd_preview(
    job_id: str,
    style: VideoStyle,
    format: VideoFormat,
    duration: VideoDuration,
    language: str,
):
    print(f"📝 Generando storyboard para job {job_id}...\n")
    brief = await step_preview(job_id, style, format, duration, language)
    _print_brief(brief, job_id)


async def _cmd_generate(job_id: str):
    print(f"🎬 Generando video para job {job_id}...\n")
    print("   Esto puede tardar varios minutos.\n")
    output = await step_generate(job_id)
    print(f"✅ Video generado: {output}")


def _cmd_status(job_id: str):
    job = get_job(job_id)
    print(f"📋 Job {job.id}")
    print(f"   Estado: {job.status.value}")
    print(f"   URL: {job.product_url}")
    if job.style:
        print(f"   Estilo: {job.style.value}")
    if job.format:
        print(f"   Formato: {job.format.value}")
    if job.duration:
        print(f"   Duración: {job.duration.value}s")
    if job.output_path:
        print(f"   Output: {job.output_path}")
    if job.error:
        print(f"   Error: {job.error}")


def _cmd_list():
    jobs = list_jobs()
    if not jobs:
        print("No hay jobs.")
        return
    print(f"📋 {len(jobs)} jobs:\n")
    for j in jobs[:10]:
        status_icon = {
            JobStatus.ANALYZED: "🔍",
            JobStatus.PREVIEWED: "📝",
            JobStatus.GENERATING: "⏳",
            JobStatus.COMPLETED: "✅",
            JobStatus.FAILED: "❌",
        }.get(j.status, "❓")
        name = j.product_data.get("title", "?")[:50]
        print(f"  {status_icon} [{j.id}] {j.status.value:12s} {name}")


def _print_analysis(result: AnalysisResult):
    print(f"📦 Producto: {result.product_name}")
    print(f"💰 Precio: {result.product_price}")
    if result.product_rating:
        print(f"⭐ {result.product_rating}/5 ({result.product_review_count} reviews)")
    print(f"🖼️  {result.product_image_count} imágenes")
    print(f"\n🎬 Estilos sugeridos:")
    for i, s in enumerate(result.suggested_styles, 1):
        print(f"   {i}. {s.style.value} - {s.label}")
        print(f"      {s.reason}")
    print(f"\n📐 Formatos: {' | '.join(f.value for f in result.available_formats)}")
    print(f"⏱️  Duraciones: {' | '.join(str(d.value) + 's' for d in result.available_durations)}")
    print(f"\n🆔 Job ID: {result.job_id}")
    print(f"\nSiguiente paso:")
    s = result.suggested_styles[0]
    print(f"  ugc-bot preview --job {result.job_id} --style {s.style.value} --format 9:16 --duration 30")


def _print_brief(brief: CreativeBrief, job_id: str):
    print(f"💡 Concepto: {brief.summary}")
    print(f"🎨 Paleta: {brief.color_palette}")
    print(f"🎵 Música: {brief.music_mood}")
    print(f"\n📋 STORYBOARD ({brief.duration.value}s, {brief.format.value}):\n")
    for seg in brief.storyboard:
        print(f"  {seg.time_range}")
        print(f"    📹 {seg.visual}")
        if seg.camera:
            print(f"    🎥 Cámara: {seg.camera}")
        if seg.text_overlay:
            print(f"    ✏️  Texto: {seg.text_overlay}")
        print()
    print(f"🎙️  VOZ EN OFF:")
    print(f"   \"{brief.voiceover_script}\"\n")
    print(f"¿Aprobar? Siguiente paso:")
    print(f"  ugc-bot generate --job {job_id}")


if __name__ == "__main__":
    main()
