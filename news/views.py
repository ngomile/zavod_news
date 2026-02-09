from django.db import transaction
from django.contrib.auth.models import User
from rest_framework import status
from rest_framework.viewsets import ModelViewSet
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.pagination import PageNumberPagination
from django_filters import rest_framework as filters
from .models import Article, Tag
from .serializers import ArticleSerializer, TagSerializer

class TagViewSet(ModelViewSet):
    queryset = Tag.objects.all()
    serializer_class = TagSerializer

class ArtileFilter(filters.FilterSet):
    '''Filter for the Article model by tag.'''
    tag = filters.NumberFilter(field_name='tags__id')

    class Meta:
        model = Article
        fields = ['tag']

class ArticlePaginator(PageNumberPagination):
    page_size = 3

class ArticleViewSet(ModelViewSet):
    queryset = Article.objects.all()
    serializer_class = ArticleSerializer
    pagination_class = ArticlePaginator
    filter_backends = [filters.DjangoFilterBackend]
    filterset_class = ArtileFilter

    def retrieve(self, request, *args, **kwargs):
        '''Override the retrieve method to increment the view count of the article.'''
        instance = self.get_object()
        instance.add_view()

        serializer = self.get_serializer(instance)

        return Response(serializer.data)

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        with transaction.atomic():
            article = serializer.save()
            article.set_tags(request.data.get('tag_ids', []))
            article.set_images(request.FILES.getlist('images'))

        # RE-SERIALIZE to include the tags and images in the response
        final_serializer = self.get_serializer(article)
        return Response(final_serializer.data, status=status.HTTP_201_CREATED)

    def get_queryset(self):
        queryset = super().get_queryset()

        order_by = self.request.query_params.get('order_by', None)

        if order_by:
            queryset = queryset.order_by('-views')
        else:
            queryset = queryset.order_by('-created_at')

        page_size = self.request.query_params.get('page_size', None)

        if page_size:
            try:
                page_size = int(page_size)
                if page_size > 0:
                    self.paginator.page_size = page_size
            except ValueError:
                pass

        return queryset
