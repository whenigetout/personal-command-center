from pathlib import Path
from django.conf import settings
import mn_contracts.ocr as d
from pydantic import ValidationError
import subprocess
import tempfile
import os

def is_path_inside(path: Path, base: Path) -> bool:
    try:
        path.resolve().relative_to(base.resolve())
        return True
    except ValueError:
        return False

def build_media_Ref(namespace: str, path: str) -> d.MediaRef:
    try:
        ns: d.MediaNamespace = d.MediaNamespace.INPUTS if namespace == "inputs" else d.MediaNamespace.OUTPUTS
        media_ref = d.MediaRef(
            namespace=ns,
            path=path,
        )
        return media_ref
    except ValidationError as e:
        raise ValueError("Invalid path passed")
    
def resolve_json_artifact(
    ocr_json_path: Path,
    kind: str,
) -> Path:
    """
    Given an OCR JSON path, resolve the derived artifact path.
    """
    if not kind or kind == "ocr":
        return ocr_json_path

    if kind == "video_preview":
        return (
            ocr_json_path.parent
            / "video_preview"
            / "preview.json"
        )

    raise ValueError(f"Unknown json kind: {kind}")

def convert_to_wav_ffmpeg(
    raw_bytes: bytes,
    out_path: Path,
    *,
    sample_rate: int = 22050,
    channels: int = 1,
) -> None:
    out_path.parent.mkdir(parents=True, exist_ok=True)

    # Create temp file (Windows-safe)
    fd, tmp_name = tempfile.mkstemp(suffix=".input")
    tmp_path = Path(tmp_name)

    try:
        # Write bytes, then close FD so ffmpeg can read it
        with os.fdopen(fd, "wb") as f:
            f.write(raw_bytes)

        cmd = [
            "ffmpeg",
            "-y",
            "-loglevel", "error",
            "-i", str(tmp_path),
            "-ac", str(channels),
            "-ar", str(sample_rate),
            "-f", "wav",
            str(out_path),
        ]

        subprocess.run(cmd, check=True)

    finally:
        # pathlib-style cleanup
        if tmp_path.exists():
            try:
                tmp_path.unlink()
            except Exception:
                pass

