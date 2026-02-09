import logging
from rest_framework import serializers

from .models import (
    Article,
    Tag,
    ArticleImage,
    Reaction,
    Comment
)

class TagSerializer(serializers.ModelSerializer):
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
            'image',
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
    tags = TagSerializer(
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
    likes_count = serializers.SerializerMethodField()
    dislikes_count = serializers.SerializerMethodField()
    user_reaction = serializers.SerializerMethodField()
    comments = CommentSerializer(
        many=True,
        read_only=True
    )
    class Meta:
        model = Article
        fields = '__all__'
        read_only_fields = [
            'id', 
            'views', 
            'likes_count', 
            'dislikes_count', 
            'user_reaction', 
            'created_at', 
            'updated_at',
            'comments'
        ]
    
    def get_likes_count(self, obj):
        return obj.get_reaction_count('like')

    def get_dislikes_count(self, obj):
        return obj.get_reaction_count('dislike')

    def get_user_reaction(self, obj):
        # Use self.context.get('request') as you were
        request = self.context.get('request')
        
        if request and request.user.is_authenticated:
            user = request.user
            # LOGGING: Use print for guaranteed visibility in the terminal
            print(f"Checking reaction for {user.username} on article {obj.id}")
            
            # Match your model field name 'type'
            reaction = Reaction.objects.filter(user=user, article=obj).first()
            return reaction.type if reaction else None
        
        return None

class ReactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Reaction
        fields = '__all__'
        read_only_fields = [
            'id',
            'created_at',
            'updated_at',
        ]
