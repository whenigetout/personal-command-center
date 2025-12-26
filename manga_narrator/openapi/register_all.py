from .registry import register_endpoint
from manga_narrator.contracts.manga_dir import MangaInputDirResponse, MangaOutputDirResponse

register_endpoint(
    name="manga_dir_view",
    path="/api/manga/dir/",
    method="GET",
    response_model=MangaInputDirResponse,
    summary="List folders and images",
)

register_endpoint(
    name="manga_output_dir_view",
    path="/api/manga/output_dir/",
    method="GET",
    response_model=MangaOutputDirResponse,
    summary="List folders and json files",
)
