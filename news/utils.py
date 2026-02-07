import os

from django.conf import settings

def article_image_upload_path(instance, filename):
    media_root = getattr(settings, 'MEDIA_ROOT')

    return os.path.join(media_root, 'articles', str(instance.id), filename)
