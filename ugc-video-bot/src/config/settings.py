from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    # API Keys
    anthropic_api_key: str = ""
    supabase_url: str = ""
    supabase_service_key: str = ""

    # Redis
    redis_url: str = "redis://localhost:6379/0"

    # GPU Pod
    gpu_pod_host: str = "localhost"
    gpu_pod_port: int = 50051
    gpu_pod_api_key: str = ""

    # TTS
    tts_model: str = "fish-speech-v1.5"
    tts_default_voice: str = "neutral_female_es"

    # Video
    video_model: str = "wan2.2-s2v"
    default_avatar: str = "female_01"
    video_resolution: str = "1080x1920"
    video_fps: int = 24

    # App
    app_env: str = "production"
    log_level: str = "INFO"
    max_concurrent_jobs: int = 3
    output_dir: str = "/data/outputs"
    temp_dir: str = "/data/tmp"

    model_config = {"env_file": ".env", "env_file_encoding": "utf-8"}


settings = Settings()
