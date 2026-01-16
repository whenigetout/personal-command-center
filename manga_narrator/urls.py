from django.urls import path
from .views import manga_dir_view, manga_json_file_view, latest_tts_audio_view, save_augmented_ocr_json, manga_image_view, save_recorded_audio

urlpatterns = [
    path('manga/dir/', manga_dir_view, name='manga-dir'),
    path('manga/json_file/', manga_json_file_view, name='manga-json-file'),
    path("manga/latest_audio/", latest_tts_audio_view, name='manga-latest-audio'),
    path("manga/save_json/", save_augmented_ocr_json, name='save-ocr-json'),
    path("manga/save_recorded_audio/", save_recorded_audio, name='save-recorded-audio'),
    path("manga/image/", manga_image_view),
]
