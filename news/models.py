from django.db import models
from django.contrib.auth.models import User
from .utils import article_image_upload_path

class ArticleQuerySet(models.QuerySet):
    pass

class ArticlesManager(models.Manager):
    model = type['Article']

    def get_queryset(self, *args, **kwargs):
        return ArticleQuerySet(
            self.model,
            using=self.db
        ).annotate(
            models.Count(
                models.F('reactions')
            )
        )

class Article(models.Model):
    objects = ArticlesManager()

    title = models.CharField(max_length=255)
    lead_img = models.ImageField(upload_to=article_image_upload_path)
    content = models.TextField()
    views = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def add_view(self):
        self.views += 1
        self.save(update_fields=['views'])

    def get_reactions(self, type = None):
        if type:
            reactions = Reaction.objects.filter(
                article=self,
                reaction=type
            )
        else:
            reactions = Reaction.objects.filter(
                article=self
            )

        return reactions

    def get_user_reaction(self, user):
        try:
            article_reaction = Reaction.objects.get(
                article=self,
                user=user
            )

            return article_reaction.reaction
        except Reaction.DoesNotExist:
            return None

    def get_reaction_count(self, type = None):
        reactions = self.get_reactions(type)
        return reactions.count()

    def set_user_reaction(self, reaction, user):
        article_reaction, _ = Reaction.objects.get_or_create(  # noqa: E501
            article=self,
            user=user
        )

        if article_reaction.reaction == reaction:
            article_reaction.delete()
        else:
            article_reaction.reaction = reaction
            article_reaction.save()

    def set_tags(self, tag_ids):
        tags = Tag.objects.filter(id__in=tag_ids)
        self.tags.set(tags) # type: ignore

    def set_images(self, image_files):
        for image in image_files:
            ArticleImage.objects.create(
                article=self,
                image=image
            )

    def __str__(self):
        return self.title

    class Meta:
        ordering = ['-created_at']

class ArticleImage(models.Model):
    article = models.ForeignKey(
        Article,
        on_delete=models.CASCADE,
        related_name='images'
    )
    image = models.ImageField(
        upload_to=article_image_upload_path
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f'{self.image.name}'

class ArticleTagQuerySet(models.QuerySet):
    pass

class ArticleTagManager(models.Manager):
    model = type['Tag']

    def get_queryset(self, *args, **kwargs):
        return ArticleTagQuerySet(
            model=self.model,
            using=self.db
        ).annotate(
            views=models.Sum('article__views')
        )

class Tag(models.Model):
    objects = ArticleTagManager()

    article = models.ManyToManyField(
        Article,
        related_name='tags'
    )
    label = models.CharField(
        max_length=120
    )
    created_at = models.DateTimeField(
        auto_now_add=True
    )
    updated_at = models.DateTimeField(
        auto_now=True
    )

    def __str__(self):
        return self.label

class Reaction(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='reactions')
    reaction = models.CharField(
        max_length=255,
        choices=(
            ('like', 'Like'),
            ('dislike', 'Dislike'),
        )
    )
    article = models.ForeignKey(
        Article,
        on_delete=models.CASCADE,
        related_name='reactions',
    )
    created_at = models.DateTimeField(
        auto_now_add=True
    )
    updated_at = models.DateTimeField(
        auto_now=True
    )

    def __str__(self):
        return f'{self.user.username} - {self.reaction} - {self.article.title}'

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=['user', 'article'],
                name='unique_user_article_reaction',
            )
        ]

class Comment(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='comments')
    article = models.ForeignKey(Article, on_delete=models.CASCADE, related_name='comments')
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f'{self.user.username} - {self.article.title} - {self.content[:20]}'
