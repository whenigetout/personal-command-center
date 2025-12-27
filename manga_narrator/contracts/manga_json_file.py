from pydantic import BaseModel
from typing import List

class DialogueLineResponse(BaseModel):
    id: int
    speaker: str
    gender: str
    emotion: str
    text: str

class OCRImageResponse(BaseModel):
    image_id: str
    image_file_name: str
    image_rel_path_from_root: str
    parsed_dialogue: List[DialogueLineResponse]
    image_width: int
    image_height: int

class OCRRunResponse(BaseModel):
    run_id: str
    images: List[OCRImageResponse]
