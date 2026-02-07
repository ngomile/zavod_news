from django.urls import path, include
from rest_framework import routers
from .views import ArticleViewSet, TagViewSet

router = routers.DefaultRouter()
router.register(r'articles', ArticleViewSet)
router.register(r'tags', TagViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
