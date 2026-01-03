from .registry import register_endpoint
from manga_narrator.contracts.endpoint_contracts import MangaDirViewResponse, LatestTTSResponse
from manga_narrator.models.domain import PaddleAugmentedOCRRunResponse

register_endpoint(
    name="manga_dir_view",
    path="/api/manga/dir/",
    method="GET",
    response_model=MangaDirViewResponse,
    summary="List folders and images",
)

register_endpoint(
    name="manga_json_file_view",
    path="/api/manga/json_file/",
    method="GET",
    response_model=PaddleAugmentedOCRRunResponse,
    summary="Load results from JSON file, which is the output from OCR API",
)

register_endpoint(
    name="latest_tts_audio_view",
    path="/api/manga/latest_audio/",
    method="GET",
    response_model=LatestTTSResponse,
    summary="Load LATEST version audio file generated from TTS API",
)
