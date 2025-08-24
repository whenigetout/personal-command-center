# manga_narrator/views.py

import os
from django.http import JsonResponse
from django.views.decorators.http import require_GET, require_POST
from django.conf import settings
from django.views.decorators.csrf import csrf_exempt
import json

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
    images = []

    for entry in os.scandir(target_path):
        if entry.is_dir():
            folders.append(entry.name)
        elif entry.is_file() and entry.name.lower().endswith(('.jpg', '.jpeg', '.png')):
            images.append(entry.name)

    return JsonResponse({'folders': folders, 'images': images})


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
            files.append(entry.name)

    return JsonResponse({'folders': folders, 'files': files})

@require_GET
def manga_json_file_view(request):
    rel_path = request.GET.get('path', '').strip()
    rel_path = rel_path.lstrip('/')  # ← REMOVE leading slash if present
    base_dir = settings.MANGA_OUTPUTS_DIR
    target_path = os.path.normpath(os.path.join(base_dir, rel_path))

    print("== DEBUG JSON FILE VIEW ==")
    print("Requested:", rel_path)
    print("Resolved:", target_path)
    print("Exists?", os.path.exists(target_path))


    if not target_path.startswith(os.path.normpath(base_dir)):
        return JsonResponse({'error': 'Invalid path'}, status=400)

    if not os.path.isfile(target_path):
        return JsonResponse({'error': 'File does not exist'}, status=404)

    try:
        with open(target_path, 'r', encoding='utf-8') as f:
            content = f.read()

        return JsonResponse({'results': json.loads(content)})
    except Exception as e:
        print(f"❌ Failed to read JSON at {target_path}: {e}")
        return JsonResponse({'error': f'Failed to read JSON: {str(e)}'}, status=500)

@require_GET
def latest_tts_audio_view(request):
    rel_path = request.GET.get('path', '').strip()
    base_dir = settings.MANGA_OUTPUTS_DIR
    target_path = os.path.normpath(os.path.join(base_dir, rel_path))

    if not target_path.startswith(os.path.normpath(base_dir)):
        return JsonResponse({'error': 'Invalid path'}, status=400)

    if not os.path.exists(target_path) or not os.path.isdir(target_path):
        return JsonResponse({'error': 'Folder does not exist'}, status=404)

    wav_files = [
        f for f in os.listdir(target_path)
        if f.lower().endswith(".wav") and f.startswith("v")
    ]

    def extract_version(fname):
        try:
            ver = fname.split("__")[0]
            return int(ver.replace("v", ""))
        except:
            return -1

    wav_files.sort(key=extract_version, reverse=True)

    if not wav_files:
        return JsonResponse({
            "latest": None,
            "count": 0,
            "full_path": None,
            "url": None
        })

    latest_file = wav_files[0]
    full_path = os.path.join(target_path, latest_file)

    # Compute path relative to MEDIA_ROOT, since /media/ points to MEDIA_ROOT
    media_rel_path = os.path.relpath(full_path, settings.MEDIA_ROOT).replace("\\", "/")
    relative_url = f"{settings.MEDIA_URL}{media_rel_path}"
    absolute_url = request.build_absolute_uri(relative_url)

    return JsonResponse({
        "latest": latest_file,
        "count": len(wav_files),
        "full_path": full_path,
        "url": absolute_url
    })

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
