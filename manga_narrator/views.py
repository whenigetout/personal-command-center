# manga_narrator/views.py

import os
from django.http import JsonResponse, FileResponse
from django.views.decorators.http import require_GET, require_POST
from django.conf import settings
from django.views.decorators.csrf import csrf_exempt
import json
from pathlib import Path
import mn_contracts.ocr as ocr
from manga_narrator.contracts.endpoint_contracts import (
    MangaDirViewResponse,
    LatestTTSResponse
)
import manga_narrator.utils as utils
import mn_contracts.video as v
from pydantic import ValidationError
from typing import List

INPUTS_NAMESPACE, OUTPUTSNAMESPACE = settings.MEDIA_NAMESPACE_KEYS

# views.py
@require_GET
def manga_dir_view(request) -> JsonResponse:
    try:
        media_ref = utils.build_media_Ref(
            namespace=request.GET.get("namespace", "").strip(),
            path=request.GET.get("path", "").strip(),
        )

        # Restrict to INPUTS dir 
        base_dir = media_ref.namespace_path(Path(settings.MEDIA_ROOT))
        target_path = media_ref.resolve(Path(settings.MEDIA_ROOT))

        if not utils.is_path_inside(target_path, base_dir):
            raise ValueError("Invalid path param passed.")

        if not target_path.exists():
            raise ValueError("Path doesn't exist.")
        
        if not target_path.is_dir():
            raise ValueError("Path is not a directory.")

        folders: List[ocr.MediaRef] = []
        files: List[ocr.MediaRef] = []

        required_file_types = ['.jpg', '.png', '.jpeg'] if media_ref.namespace == INPUTS_NAMESPACE else [".json"]

        for entry in target_path.iterdir():
            rel_path = str(entry.relative_to(base_dir).as_posix())
            if entry.is_dir():
                folders.append(ocr.MediaRef(
                    namespace=media_ref.namespace,
                    path=rel_path
                ))
            elif entry.is_file() and entry.suffix in required_file_types:  
                # if it's a json file, filter by file name
                if entry.suffix == ".json" and not(
                    entry.name == "ocrrun.json"
                    or "final" in entry.name
                ):
                    continue

                files.append(ocr.MediaRef(
                    namespace=media_ref.namespace,
                    path=rel_path
                ))

        response = MangaDirViewResponse(
            folders=folders,
            files=files
        )

        return JsonResponse(response.model_dump(), safe=False)
    except Exception as e:
        raise 

@require_GET
def manga_json_file_view(request) -> JsonResponse:
    try:
        media_ref = utils.build_media_Ref(
            namespace=request.GET.get("namespace", "").strip(),
            path=request.GET.get("path", "").strip(),
        )

        kind=request.GET.get("kind", "").strip()

        # Restrict to OUTPUTS dir 
        base_dir = media_ref.namespace_path(Path(settings.MEDIA_ROOT))
        ocr_json_path = media_ref.resolve(Path(settings.MEDIA_ROOT))

        target_path = utils.resolve_json_artifact(
            ocr_json_path=ocr_json_path,
            kind=kind
        )

        if not utils.is_path_inside(target_path, base_dir) or media_ref.namespace != OUTPUTSNAMESPACE:
            raise ValueError("Invalid path param passed.")

        if not target_path.exists():
            return JsonResponse({
                "success": False,
                "error": "Preview doesn't exist yet."
            })
        
        if not target_path.is_file() or target_path.suffix.lower() != ".json":
            raise ValueError("Path is not a json file.")

        # 1️⃣ DOMAIN: parse + validate raw OCR json
        with open(target_path, "r", encoding="utf-8") as f:
            raw = json.load(f)

        if kind == "video_preview":
            obj = v.VideoPreview.model_validate(raw)
        else:
            obj = ocr.OCRRun.model_validate(raw)

        return JsonResponse(obj.model_dump(), safe=False)

    except Exception as e:
        print(f"❌ Failed to load OCR JSON {target_path}: {e}")
        raise

@require_GET
def latest_tts_audio_view(request):
    """
    Returns the latest generated TTS audio file.
    Always returns a consistent JSON response.
    Input is the img file mediaref (namespace and path) and run_id.
    """

    try:
        run_id=request.GET.get("run_id", "").strip()
        dlg_id=int(request.GET.get("dlg_id", "").strip())
        if not run_id or dlg_id < 0:
            raise ValueError("Invalid run_id or dlg_id passed.")
        
        media_ref = utils.build_media_Ref(
            namespace=request.GET.get("namespace", "").strip(),
            path=request.GET.get("path", "").strip(),
        )

        def audio_out_dir_path(
                root: Path,
                img_ref: ocr.MediaRef,
                dlgId: int
        ) -> Path:
            ns = ocr.MediaNamespace.OUTPUTS.value
            img_path_without_ext = Path(img_ref.path).with_suffix("")
            img_ext_without_dot = img_ref.suffix[1:] # exclude the "."
            out_dir: Path = Path(root)/ns/run_id/f"{img_path_without_ext}_{img_ext_without_dot}/dialogue__{dlgId}"
            return out_dir
        
        base_dir = Path(settings.MEDIA_ROOT) / ocr.MediaNamespace.OUTPUTS.value
        target_path = audio_out_dir_path(
            Path(settings.MEDIA_ROOT),
            media_ref,
            dlg_id
        )

        # should be inside outputs folder
        if not utils.is_path_inside(target_path, base_dir):
            raise ValueError("Invalid path param passed.")

        if not target_path.exists():
            response = LatestTTSResponse(
                    status="success",
                    audio_path=None,
                    error="TTS Not generated yet."
                )
            return JsonResponse(
                response.model_dump(),
                safe=False,
                status=200
            )
        
        if not target_path.is_dir():
            raise ValueError("Path is not a folder.")
        
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
            status_code = 404 if audio_files is None else 200
            response = LatestTTSResponse(
                    status="error" if audio_files is None else "success",
                    audio_path=None,
                    error="No TTS audio files found"
                )
            return JsonResponse(
                response.model_dump(),
                safe=False,
                status=status_code
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
        raise

@require_GET
def manga_image_view(request) -> FileResponse:
    """
    Serve a manga image safely from disk.
    """
    try:
        media_ref = utils.build_media_Ref(
            namespace=request.GET.get("namespace", "").strip(),
            path=request.GET.get("path", "").strip(),
        )

        base_dir = media_ref.namespace_path(Path(settings.MEDIA_ROOT))
        target_path = media_ref.resolve(Path(settings.MEDIA_ROOT))

        if not utils.is_path_inside(target_path, base_dir):
            raise ValueError("Invalid path param passed.")

        if not target_path.exists():
            raise ValueError("Path doesn't exist.")
        
        if not target_path.is_file():
            raise ValueError("Path is not a folder.")

        return FileResponse(open(target_path, "rb"), content_type="image/jpeg")
    except Exception as e:
        raise

@csrf_exempt
@require_POST
def save_augmented_ocr_json(request):
    try:
        body = json.loads(request.body)
        
        # Default filename for corrected ocr
        output_file_name = "ocrrun_final.json"

        try:
            run_response = ocr.OCRRun.model_validate(body)
        except ValidationError as e:
            return JsonResponse(
                {"error": "Invalid PaddleAugmentedOCRRunResponse", "details": e.errors()},
                status=400
            )

        ocr_ref = run_response.ocr_json_file

        # Full path to existing OCR json file
        original_file = ocr_ref.resolve(Path(settings.MEDIA_ROOT))

        # Parent directory of existing OCR json
        target_dir = original_file.parent

        # Final output path
        target_file = (target_dir / output_file_name).resolve()

        base = run_response.model_dump(exclude={"ocr_json_file"})
        target_file_ref = utils.build_media_Ref(
                namespace=ocr.MediaNamespace.OUTPUTS,
                path=str(target_file.relative_to(Path(settings.MEDIA_ROOT) / ocr.MediaNamespace.OUTPUTS.value))
            )
        result = ocr.OCRRun(
            **base,
            ocr_json_file=target_file_ref
        )

        # Save JSON
        target_dir.mkdir(parents=True, exist_ok=True)
        target_file.write_text(
            json.dumps(
                result.model_dump(),
                ensure_ascii=False,
                indent=2
            ),
            encoding="utf-8"
        )

        return JsonResponse({
            "success": True,
            "saved_as": str(target_file.relative_to(ocr_ref.namespace_path(Path(settings.MEDIA_ROOT))))
        })

    except json.JSONDecodeError:
        return JsonResponse({"error": "Invalid JSON"}, status=400)

    except Exception as e:
        print(f"Error saving augmented OCR JSON: {e}")
        return JsonResponse({"error": str(e)}, status=500)
