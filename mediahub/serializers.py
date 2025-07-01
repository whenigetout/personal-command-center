from rest_framework import serializers
from .models import Video, Tag, Actress

class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = '__all__'

class ActressSerializer(serializers.ModelSerializer):
    class Meta:
        model = Actress
        fields = '__all__'

class VideoSerializer(serializers.ModelSerializer):
    tags = TagSerializer(many=True, read_only=True)
    actresses = ActressSerializer(many=True, read_only=True)

    class Meta:
        model = Video
        fields = '__all__'
