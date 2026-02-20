"""Gestor de jobs con persistencia en disco (JSON).

Simple y portable -- ClawBot no necesita Redis para esto.
"""

import json
import uuid
from pathlib import Path

import structlog

from src.config.settings import settings

from . import Job, JobStatus

logger = structlog.get_logger()


JOBS_DIR = Path(settings.temp_dir) / "jobs"


def _ensure_dir():
    JOBS_DIR.mkdir(parents=True, exist_ok=True)


def create_job(product_url: str) -> Job:
    """Crea un nuevo job."""
    _ensure_dir()
    job = Job(
        id=uuid.uuid4().hex[:8],
        status=JobStatus.ANALYZED,
        product_url=product_url,
    )
    _save(job)
    logger.info("job_created", job_id=job.id, url=product_url)
    return job


def get_job(job_id: str) -> Job:
    """Recupera un job por ID."""
    path = JOBS_DIR / f"{job_id}.json"
    if not path.exists():
        raise FileNotFoundError(f"Job {job_id} no encontrado")
    data = json.loads(path.read_text())
    return Job(**data)


def update_job(job: Job) -> None:
    """Actualiza un job en disco."""
    _save(job)
    logger.info("job_updated", job_id=job.id, status=job.status)


def list_jobs(status: JobStatus | None = None) -> list[Job]:
    """Lista todos los jobs, opcionalmente filtrados por estado."""
    _ensure_dir()
    jobs = []
    for path in JOBS_DIR.glob("*.json"):
        try:
            data = json.loads(path.read_text())
            job = Job(**data)
            if status is None or job.status == status:
                jobs.append(job)
        except Exception:
            continue
    return sorted(jobs, key=lambda j: j.created_at, reverse=True)


def _save(job: Job) -> None:
    _ensure_dir()
    path = JOBS_DIR / f"{job.id}.json"
    path.write_text(job.model_dump_json(indent=2))
