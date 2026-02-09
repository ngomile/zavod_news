from django.urls import path
from . import consumers

websocket_urlpatterns = [
    path('ws/news/<int:article_id>/comments/', consumers.CommentConsumer.as_asgi()),
    path('ws/news/<int:article_id>/reactions/', consumers.ReactionConsumer.as_asgi()),
]
