from django.contrib import admin
from django.urls import path, re_path, include
from django.conf import settings
from django.views.generic import TemplateView
from django.conf.urls.static import static

urlpatterns = [
    path('django_admin/', admin.site.urls),
    path('auth/', include('api_auth.urls')),
    path('api/', include('news.urls')),
] + static(
    getattr(settings, 'MEDIA_URL'),
    document_root=getattr(settings, 'MEDIA_ROOT')
)

# Catch-all pattern to serve the React app for any unmatched routes
urlpatterns += [
    re_path(
        r'^.*$',
        TemplateView.as_view(template_name='news_app/index.html'),
    ),
]
