from rest_framework import serializers

from .models import (
    Article,
    Tag,
    ArticleImage,
    Reaction,
    Comment
)

class ArticleTagSerializer(serializers.ModelSerializer):
    '''
    Serializer for the Tag model.'''
    views = serializers.SerializerMethodField()

    def get_views(self, obj):
        return obj.views

    class Meta:
        model = Tag
        fields = [
            'id',
            'label',
            'views',
        ]

        read_only_fields = [
            'id',
            'views',
        ]

class ArticleImageSerializer(serializers.ModelSerializer):
    '''
    Serializer for the ArticleImage model.'''
    class Meta:
        model = ArticleImage
        fields = [
            'id',
            'image',
        ]

        read_only_fields = [
            'id'
        ]

class CommentSerializer(serializers.ModelSerializer):
    '''
    Serializer for the Comment model.'''
    user = serializers.StringRelatedField(read_only=True)
    article = serializers.StringRelatedField(read_only=True)

    class Meta:
        model = Comment
        fields = [
            'id',
            'user',
            'article',
            'content',
            'created_at',
            'updated_at'
        ]

        read_only_fields = [
            'id',
            'user',
            'article',
            'created_at',
            'updated_at'
        ]

class ArticleSerializer(serializers.ModelSerializer):
    tags = ArticleTagSerializer(
        many=True,
        read_only=True
    )
    lead_image = serializers.ImageField(
        required=False
    )
    images = ArticleImageSerializer(
        many=True,
        read_only=True
    )

    class Meta:
        model = Article
        fields = '__all__'
        read_only_fields = [
            'id',
            'created_at',
            'updated_at',
            'views'
        ]

class ReactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Reaction
        fields = '__all__'
        read_only_fields = [
            'id',
            'created_at',
            'updated_at',
        ]
