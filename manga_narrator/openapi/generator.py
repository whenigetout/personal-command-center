from pydantic.json_schema import models_json_schema
from .registry import SCHEMA_REGISTRY

def generate_openapi_schema():
    paths = {}
    components = {}

    def register_model(model):
        schema = model.model_json_schema()

        # Pull out nested definitions ($defs)
        defs = schema.pop("$defs", {})

        # Register the main model
        components[model.__name__] = schema

        # Register nested models
        for name, def_schema in defs.items():
            components[name] = def_schema

    for ep in SCHEMA_REGISTRY.values():
        model = ep.response_model

        register_model(model)

        paths.setdefault(ep.path, {})
        paths[ep.path][ep.method] = {
            "summary": ep.summary,
            "description": ep.description,
            "responses": {
                "200": {
                    "description": "Success",
                    "content": {
                        "application/json": {
                            "schema": {
                                "$ref": f"#/components/schemas/{model.__name__}"
                            }
                        }
                    }
                }
            }
        }

    # Rewrite $refs from #/$defs → #/components/schemas
    def rewrite_refs(obj):
        if isinstance(obj, dict):
            for k, v in obj.items():
                if k == "$ref" and v.startswith("#/$defs/"):
                    obj[k] = v.replace("#/$defs/", "#/components/schemas/")
                else:
                    rewrite_refs(v)
        elif isinstance(obj, list):
            for item in obj:
                rewrite_refs(item)

    for schema in components.values():
        rewrite_refs(schema)

    return {
        "openapi": "3.0.0",
        "info": {
            "title": "Manga Narrator API",
            "version": "1.0.0"
        },
        "paths": paths,
        "components": {
            "schemas": components
        }
    }
