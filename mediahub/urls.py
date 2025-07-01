from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (VideoViewSet, 
                    TagViewSet, 
                    ActressViewSet, 
                    sync_folder, 
                    delete_all_videos, 
                    stream_video,
                    generate_thumbnail,)

router = DefaultRouter()
router.register(r'videos', VideoViewSet)
router.register(r'tags', TagViewSet)
router.register(r'actresses', ActressViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('sync-folder/', sync_folder),
    path('delete-all/', delete_all_videos),
    path('stream/', stream_video),
    path('thumbnail/', generate_thumbnail),
]
