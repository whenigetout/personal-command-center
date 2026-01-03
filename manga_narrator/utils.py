from pathlib import Path
from django.conf import settings
import manga_narrator.models.domain as d
from pydantic import ValidationError

def is_path_inside(path: Path, base: Path) -> bool:
    try:
        path.resolve().relative_to(base.resolve())
        return True
    except ValueError:
        return False

def build_media_Ref(namespace: str, path: str) -> d.MediaRef:
    try:
        if namespace not in ["inputs", "outputs"]:
            raise
        ns: d.MediaNamespace = d.MediaNamespace.INPUTS if namespace == "inputs" else d.MediaNamespace.OUTPUTS
        media_ref = d.MediaRef(
            namespace=ns,
            path=path,
        )
        return media_ref
    except ValidationError as e:
        raise ValueError("Invalid path passed")