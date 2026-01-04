from pydantic import BaseModel, field_validator
from enum import Enum
from pathlib import Path
from typing import Literal, Any, Optional, List
import json

class MediaNamespace(str, Enum):
    INPUTS = "inputs"
    OUTPUTS = "outputs"

class MediaRef(BaseModel):
    namespace: MediaNamespace
    path: str

    @field_validator("path")
    @classmethod
    def validate_path(cls, v: str) -> str:
        p = Path(v)

        # must be relative
        if p.is_absolute():
            raise ValueError("MediaRef.path must be a relative path")

        # no traversal
        if ".." in p.parts:
            raise ValueError("MediaRef.path must not contain '..'")

        # normalize to posix
        return p.as_posix()

    @property
    def filename(self) -> str:
        return Path(self.path).name

    @property
    def suffix(self) -> str:
        return Path(self.path).suffix
    
    @property
    def posix_path_from_media_root(self) -> str:
        return str(Path(self.namespace.value) / self.path)
    
    @property
    def posix_path_from_namespace(self) -> str:
        return str(Path(self.path).as_posix)
    
    def namespace_path(self, media_root: Path) -> Path:
        return media_root / self.namespace.value 
    
    def resolve(self, media_root: Path) -> Path:
        return media_root / self.namespace.value / self.path

class InferImageResponse(BaseModel):
    image_ref: MediaRef
    image_text: Any
    image_width: int
    image_height: int
    input_tokens: int
    output_tokens: int
    throughput: float

class DialogueLineResponse(BaseModel):
    id: int
    image_id: str
    speaker: str
    gender: str
    emotion: str
    text: str

class OCRImage(BaseModel):
    image_id: str
    inferImageRes: InferImageResponse
    parsedDialogueLines: list[DialogueLineResponse]

class OCRRunResponse(BaseModel):
    run_id: str
    imageResults: List[OCRImage]
    error: Optional[str] = None

# Augmented by paddleocr (this service)
class PaddleBBox(BaseModel):
    x1: float
    y1: float
    x2: float
    y2: float
    poly: list[list[float]]
    matched_rec_text_index: int
    matched_rec_text_index_orig: int

class PaddleDialogueLineResponse(DialogueLineResponse):
    paddlebbox: PaddleBBox

class PaddleOCRImage(OCRImage):
    parsedDialogueLines: list[PaddleDialogueLineResponse]
    paddleocr_result: Optional[Any] = None

class PaddleAugmentedOCRRunResponse(OCRRunResponse):
    # path to THE json file (with bboxes)
    ocr_json_file: MediaRef
    imageResults: List[PaddleOCRImage]

    @classmethod
    def from_json_file(cls, path: Path) -> "PaddleAugmentedOCRRunResponse":
        try:
            with path.open("r", encoding="utf-8") as f:
                data = json.load(f)
        except FileNotFoundError:
            raise ValueError(f"OCR json file not found: {path}")
        except json.JSONDecodeError as e:
            raise ValueError(f"Invalid JSON in OCR file: {path}") from e

        return cls.model_validate(data)
