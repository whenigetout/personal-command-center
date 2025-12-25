# openapi/views.py
from django.http import JsonResponse
from django.views.decorators.http import require_GET

from .generator import generate_openapi_schema
from . import register_all  # forces endpoint registration

@require_GET
def openapi_view(request):
    """
    Returns the OpenAPI schema for the entire service.
    """
    return JsonResponse(generate_openapi_schema())
