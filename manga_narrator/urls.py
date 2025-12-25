from django.urls import path
from .views import manga_dir_view, manga_output_dir_view, manga_json_file_view, latest_tts_audio_view, save_ocr_json, manga_image_view
from manga_narrator.openapi.views import openapi_view

urlpatterns = [
    path('manga/dir/', manga_dir_view, name='manga-dir'),
    path("manga/output_dir/", manga_output_dir_view, name='manga-output-dir'),
    path('manga/json_file/', manga_json_file_view, name='manga-json-file'),
    path("manga/latest_audio/", latest_tts_audio_view, name='manga-latest-audio'),
    path("manga/save_json/", save_ocr_json, name='save-ocr-json'),
    path("manga/image/", manga_image_view),
    path("manga/openapi.json", openapi_view),
]
