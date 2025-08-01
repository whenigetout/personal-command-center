import os
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Video

from rest_framework import viewsets
from .models import Video, Tag, Actress
from .serializers import VideoSerializer, TagSerializer, ActressSerializer

from django.http import FileResponse, StreamingHttpResponse, Http404
from urllib.parse import unquote
from wsgiref.util import FileWrapper

import subprocess
import tempfile

class VideoViewSet(viewsets.ModelViewSet):
    queryset = Video.objects.all()
    serializer_class = VideoSerializer

class TagViewSet(viewsets.ModelViewSet):
    queryset = Tag.objects.all()
    serializer_class = TagSerializer

class ActressViewSet(viewsets.ModelViewSet):
    queryset = Actress.objects.all()
    serializer_class = ActressSerializer

@api_view(['POST'])
def sync_folder(request):
    folder_path = request.data.get('path')

    if not folder_path or not os.path.isdir(folder_path):
        return Response({'error': 'Invalid folder path'}, status=400)

    count = 0
    for root, dirs, files in os.walk(folder_path):
        for file in files:
            if file.lower().endswith(('.mp4', '.mkv', '.avi', '.mov')):
                full_path = os.path.join(root, file)
                title = os.path.splitext(file)[0]

                if not Video.objects.filter(file_path=full_path).exists():
                    Video.objects.create(title=title, file_path=full_path)
                    count += 1

    return Response({'status': f'Sync complete. {count} new videos added.'})

@api_view(['POST'])
def delete_all_videos(request):
    from .models import Video
    count, _ = Video.objects.all().delete()
    return Response({'status': f'Deleted {count} videos'})

@api_view(['GET'])
def stream_video(request):
    from urllib.parse import unquote
    file_path = unquote(request.GET.get('path', ''))
    
    if not os.path.exists(file_path):
        raise Http404()

    file_size = os.path.getsize(file_path)
    range_header = request.headers.get('Range', '').strip()
    
    content_type = 'video/mp4'  # adjust based on file extension if needed

    if range_header:
        # Parse bytes=START-END
        range_match = range_header.replace('bytes=', '').split('-')
        start = int(range_match[0])
        end = int(range_match[1]) if range_match[1] else file_size - 1
        length = end - start + 1

        def file_iterator(path, start, length):
            with open(path, 'rb') as f:
                f.seek(start)
                yield f.read(length)

        response = StreamingHttpResponse(
            file_iterator(file_path, start, length),
            status=206,
            content_type=content_type
        )
        response['Content-Range'] = f'bytes {start}-{end}/{file_size}'
        response['Content-Length'] = str(length)
        response['Accept-Ranges'] = 'bytes'
        return response

    # No Range header: serve entire file
    wrapper = FileWrapper(open(file_path, 'rb'))
    response = StreamingHttpResponse(wrapper, content_type=content_type)
    response['Content-Length'] = str(file_size)
    response['Accept-Ranges'] = 'bytes'
    return response
    
@api_view(['GET'])
def generate_thumbnail(request):
    from urllib.parse import unquote
    import os
    import subprocess
    import tempfile

    raw_path = request.query_params.get('path')
    if not raw_path:
        return Response({'error': 'Missing file path'}, status=400)

    path = unquote(raw_path).strip('"')
    print(f"Generating thumbnail for: {path}")

    if not os.path.exists(path):
        return Response({'error': f'File does not exist: {path}'}, status=404)

    try:
        temp_thumb = tempfile.NamedTemporaryFile(suffix='.jpg', delete=False)
        thumb_path = temp_thumb.name

        command = [
            'ffmpeg',
            '-y',                      # ← Add this to allow overwrite
            '-ss', '00:00:03',
            '-i', path,
            '-frames:v', '1',
            '-q:v', '2',
            thumb_path
        ]

        print("Running command:", ' '.join(command))
        result = subprocess.run(command, stdout=subprocess.PIPE, stderr=subprocess.PIPE)

        print("Return code:", result.returncode)
        print("STDERR:", result.stderr.decode())

        if result.returncode != 0:
            return Response({'error': 'FFmpeg failed', 'detail': result.stderr.decode()}, status=500)

        if not os.path.exists(thumb_path) or os.path.getsize(thumb_path) == 0:
            return Response({'error': 'Thumbnail file was not created'}, status=500)

        print(f"Thumbnail created at: {thumb_path}")
        return FileResponse(open(thumb_path, 'rb'), content_type='image/jpeg')

    except Exception as e:
        return Response({'error': str(e)}, status=500)

