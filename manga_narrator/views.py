# manga_narrator/views.py

import os
from django.http import JsonResponse, FileResponse
from django.views.decorators.http import require_GET, require_POST
from django.conf import settings
from django.views.decorators.csrf import csrf_exempt
import json
from pathlib import Path
from manga_narrator.domain_models import OCRRun
from manga_narrator.contracts.manga_dir import (
    ImageEntry,
    FileEntry,
    MangaInputDirResponse,
    MangaOutputDirResponse
)
from manga_narrator.contracts.manga_json_file import (
    DialogueLineResponse,
    OCRImageResponse,
    OCRRunResponse
)
from manga_narrator.contracts.manga_latest_audio import LatestTTSResponse


BASE_MANGA_DIR = settings.MANGA_RUNS_DIR

# views.py
@require_GET
def manga_dir_view(request):
    rel_path = request.GET.get('path', '').strip()

    # Restrict to INPUTS dir instead of full MANGA_RUNS_DIR
    base_dir = settings.MANGA_INPUTS_DIR
    target_path = os.path.normpath(os.path.join(base_dir, rel_path))

    if not target_path.startswith(os.path.normpath(base_dir)):
        print("Invalid path param passed to manga_dir_view")
        return JsonResponse({'error': 'Invalid path'}, status=400)

    if not os.path.exists(target_path):
        print("Path doesn't exist.")
        return JsonResponse({'error': 'Path does not exist'}, status=404)

    folders = []
    files = []

    for entry in os.scandir(target_path):
        if entry.is_dir():
            folders.append(entry.name)
        elif entry.is_file() and entry.name.lower().endswith(('.jpg', '.png', '.jpeg')):
            rel_image_path = f"{rel_path}/{entry.name}" if rel_path else entry.name

            files.append(
                ImageEntry(
                    name=entry.name,
                    relative_path=rel_image_path,
                    url=f"/api/manga/image/?path={rel_image_path}"
                )
            )

    response = MangaInputDirResponse(
        folders=folders,
        files=files
    )

    return JsonResponse(response.model_dump(), safe=False)

@require_GET
def manga_output_dir_view(request):
    rel_path = request.GET.get('path', '').strip()
    rel_path = rel_path.lstrip('/')  # ← REMOVE leading slash if present
    base_dir = settings.MANGA_OUTPUTS_DIR
    target_path = os.path.normpath(os.path.join(base_dir, rel_path))

    if not target_path.startswith(os.path.normpath(base_dir)):
        return JsonResponse({'error': 'Invalid path'}, status=400)

    if not os.path.exists(target_path):
        return JsonResponse({'error': 'Path does not exist'}, status=404)

    folders = []
    files = []

    for entry in os.scandir(target_path):
        if entry.is_dir():
            folders.append(entry.name)
        elif entry.is_file() and entry.name.lower().endswith(".json"):
            rel_file_path = f"{rel_path}/{entry.name}" if rel_path else entry.name

            files.append(
                FileEntry(
                    name=entry.name,
                    relative_path=rel_file_path,
                    url=f"/api/manga/image/?path={rel_file_path}"
                )
            )

    response = MangaOutputDirResponse(
        folders=folders,
        files=files
    )

    return JsonResponse(response.model_dump(), safe=False)

@require_GET
def manga_json_file_view(request):
    rel_path = request.GET.get("path", "").strip().lstrip("/")
    base_dir = Path(settings.MANGA_OUTPUTS_DIR).resolve()
    target_path = (base_dir / rel_path).resolve()

    # Safety check
    if not str(target_path).startswith(str(base_dir)):
        return JsonResponse({"error": "Invalid path"}, status=400)

    if not target_path.is_file():
        return JsonResponse({"error": "File does not exist"}, status=404)

    try:
        # 1️⃣ DOMAIN: parse + validate raw OCR json
        ocr_run = OCRRun.from_json_file(target_path)

        # 2️⃣ CONTRACT: map domain → API response
        response = OCRRunResponse(
            run_id=ocr_run.images[0].run_id if ocr_run.images else "",
            images=[
                OCRImageResponse(
                    image_id=img.image_id,
                    image_file_name=img.image_file_name,
                    image_rel_path_from_root=img.image_rel_path_from_root,
                    image_width=img.image_width,
                    image_height=img.image_height,
                    parsed_dialogue=[
                        DialogueLineResponse(
                            id=line.id,
                            speaker=line.speaker,
                            gender=line.gender,
                            emotion=line.emotion,
                            text=line.text,
                        )
                        for line in img.parsed_dialogue
                    ],
                )
                for img in ocr_run.images
            ],
        )

        return JsonResponse(response.model_dump(), safe=False)

    except Exception as e:
        print(f"❌ Failed to load OCR JSON {target_path}: {e}")
        return JsonResponse({"error": str(e)}, status=500)


@require_GET
def latest_tts_audio_view(request):
    """
    Returns the latest generated TTS audio file.
    Always returns a consistent JSON response.
    """

    try:
        rel_path = request.GET.get("path", "").strip().lstrip("/")
        base_dir = Path(settings.MANGA_OUTPUTS_DIR).resolve()
        target_path = (base_dir / rel_path).resolve()
        # tts_output_root = Path(settings.MEDIA_ROOT) / "tts_outputs"

        # Safety check
        if not str(target_path).startswith(str(base_dir)):
            response = LatestTTSResponse(
                    status="error",
                    audio_path=None,
                    error="Invalid path"
                )
            return JsonResponse(
                response.model_dump(),
                safe=False,
                status=400
            )

        if not target_path.exists() or not target_path.is_dir():
            response = LatestTTSResponse(
                    status="error",
                    audio_path=None,
                    error="TTS output directory does not exist"
                )
            return JsonResponse(
                response.model_dump(),
                safe=False,
                status=404
            )
        
        def extract_version(fname):
            try:
                ver = fname.split("__")[0]
                return int(ver.replace("v", ""))
            except:
                return -1

        audio_files = sorted(
            (
                p for p in target_path.glob("*.wav")
                if p.name.startswith("v") and extract_version(p.name) >= 0
            ),
            key=lambda p: extract_version(p.name),
            reverse=True
        )

        if not audio_files:
            response = LatestTTSResponse(
                    status="error",
                    audio_path=None,
                    error="No TTS audio files found"
                )
            return JsonResponse(
                response.model_dump(),
                safe=False,
                status=404
            )

        latest_audio = audio_files[0]

        # Convert to relative path if needed by frontend
        audio_path = str(latest_audio.relative_to(base_dir))
        response = LatestTTSResponse(
                status="success",
                audio_path=Path(audio_path).as_posix(),
                error=None
            )

        return JsonResponse(
            response.model_dump(),
                safe=False,
            status=200
        )

    except Exception as e:
        # --- HARD FAILURE SAFETY NET ---
        response = LatestTTSResponse(
                status="error",
                audio_path=None,
                error=str(e)
            )
        return JsonResponse(
            response.model_dump(),
            safe=False,
            status=500
        )


@csrf_exempt
@require_POST
def save_ocr_json(request):
    try:
        body = json.loads(request.body)
        rel_path = body.get("file_name", "").strip()
        rel_path = rel_path.lstrip('/')  # ← REMOVE leading slash if present
        data = body.get("data", None)

        if not rel_path or data is None:
            return JsonResponse({"error": "Missing file_name or data"}, status=400)

        base_dir = settings.MANGA_OUTPUTS_DIR
        target_path = os.path.normpath(os.path.join(base_dir, rel_path))

        # Prevent path traversal
        if not target_path.startswith(os.path.normpath(base_dir)):
            return JsonResponse({'error': 'Invalid path'}, status=400)

        # Save JSON data (indent for readability)
        with open(target_path, "w", encoding="utf-8") as f:
            json.dump(data, f, ensure_ascii=False, indent=2)

        return JsonResponse({"success": True, "file": rel_path})
    except Exception as e:
        print(f"Error saving OCR JSON: {e}")
        return JsonResponse({"error": str(e)}, status=500)

@require_GET
def manga_image_view(request):
    """
    Serve a manga image safely from MANGA_INPUTS_DIR.
    """
    rel_path = request.GET.get("path", "").strip()
    rel_path = rel_path.lstrip("/")

    base_dir = settings.MANGA_INPUTS_DIR
    target_path = os.path.normpath(os.path.join(base_dir, rel_path))

    if not target_path.startswith(os.path.normpath(base_dir)):
        return JsonResponse({"error": "Invalid path"}, status=400)

    if not os.path.isfile(target_path):
        return JsonResponse({"error": "Image not found"}, status=404)

    return FileResponse(open(target_path, "rb"), content_type="image/jpeg")
