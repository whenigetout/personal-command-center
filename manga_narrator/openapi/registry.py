from typing import Type, Dict
from pydantic import BaseModel

class EndpointSchema:
    def __init__(
        self,
        path: str,
        method: str,
        response_model: Type[BaseModel],
        summary: str = "",
        description: str = ""
    ):
        self.path = path
        self.method = method.lower()
        self.response_model = response_model
        self.summary = summary
        self.description = description

SCHEMA_REGISTRY: Dict[str, EndpointSchema] = {}

def register_endpoint(
    *,
    name: str,
    path: str,
    method: str,
    response_model: Type[BaseModel],
    summary: str = "",
    description: str = ""
):
    SCHEMA_REGISTRY[name] = EndpointSchema(
        path=path,
        method=method,
        response_model=response_model,
        summary=summary,
        description=description
    )
