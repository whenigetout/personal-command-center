from pydantic import BaseModel
from typing import Optional

class LatestTTSResponse(BaseModel):
    status: str                 # "success" | "error"
    audio_path: Optional[str]   # present on success
    error: Optional[str]        # present on error