from pydantic import BaseModel
from typing import List, Optional
import manga_narrator.models.domain as d

class MangaDirViewResponse(BaseModel):
    folders: List[d.MediaRef]
    files: List[d.MediaRef]

class LatestTTSResponse(BaseModel):
    status: str                 # "success" | "error"
    audio_path: Optional[str]   # present on success
    error: Optional[str]        # present on error