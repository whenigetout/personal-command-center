from .registry import register_endpoint
from manga_narrator.contracts.manga_dir import MangaDirResponse

register_endpoint(
    name="manga_dir_view",
    path="/api/manga/dir/",
    method="GET",
    response_model=MangaDirResponse,
    summary="List folders and images",
)
