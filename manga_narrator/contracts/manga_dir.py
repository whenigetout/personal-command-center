from pydantic import BaseModel
from typing import List

class ImageEntry(BaseModel):
    name: str
    relative_path: str
    url: str

class MangaInputDirResponse(BaseModel):
    folders: List[str]
    files: List[ImageEntry]

class FileEntry(BaseModel):
    name: str
    relative_path: str
    url: str

class MangaOutputDirResponse(BaseModel):
    folders: List[str]
    files: List[FileEntry]
