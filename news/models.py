from django.db import models
from django.contrib.auth.models import User
from .utils import article_image_upload_path

class ArticleQuerySet(models.QuerySet):
    pass

class ArticlesManager(models.Manager):
    '''Manager for Article model. Includes custom queryset methods for articles.'''
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
    '''
    Model representing a news article. Includes fields
    for title, lead image, content, view count, and timestamps.
    '''
    objects = ArticlesManager()

    title = models.CharField(max_length=255)
    lead_img = models.ImageField(upload_to=article_image_upload_path)
    content = models.TextField()
    views = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def add_view(self):
        '''Increment the view count of the article.'''
        self.views += 1
        self.save(update_fields=['views'])

    def get_reactions(self, type = None):
        '''
        Get reactions for the article. If a type is provided,
        filter reactions by that type.
        '''
        if type:
            reactions = Reaction.objects.filter(
                article=self,
                type=type
            )
        else:
            reactions = Reaction.objects.filter(
                article=self
            )

        return reactions

    def get_user_reaction(self, user):
        '''Get the reaction of a specific user for the article.'''
        try:
            article_reaction = Reaction.objects.get(
                article=self,
                user=user
            )

            return article_reaction.type
        except Reaction.DoesNotExist:
            return None

    def get_reaction_count(self, type = None):
        '''
        Get the count of reactions for the article.
        If a type is provided, filter reactions by that type.
        '''
        reactions = self.get_reactions(type)
        return reactions.count()

    def set_user_reaction(self, type, user):
        article_reaction, _ = Reaction.objects.get_or_create(
            article=self,
            user=user
        )

        # User clicked on reaction they already gave, remove it.
        # Otherwise, update to the new reaction.
        if article_reaction.type == type:
            article_reaction.delete()
        else:
            article_reaction.type = type
            article_reaction.save()

    def set_tags(self, tag_ids):
        '''Set the tags for the article.'''
        tags = Tag.objects.filter(id__in=tag_ids)
        self.tags.set(tags) # type: ignore

    def set_images(self, image_files):
        '''Set the images for the article.'''
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
    '''Model representing an image associated with an article.'''
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

class TagManager(models.Manager):
    '''Manager for Tag model. Includes custom queryset methods for tags.'''
    model = type['Tag']

    def get_queryset(self, *args, **kwargs):
        return ArticleTagQuerySet(
            model=self.model,
            using=self.db
        ).annotate(
            views=models.Sum('article__views')
        )

class Tag(models.Model):
    '''Model representing a tag that can be associated with articles.'''
    objects = TagManager()

    article = models.ManyToManyField(
        Article,
        related_name='tags'
    )
    image: models.ImageField = models.ImageField(
        upload_to='tags',
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
    '''Model representing a reaction (like or dislike) that a user can give to an article.'''
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='reactions')
    type = models.CharField(
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
        return f'{self.user.username} - {self.type} - {self.article.title}'

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=['user', 'article'],
                name='unique_user_article_reaction',
            )
        ]

class Comment(models.Model):
    '''Model representing a comment that a user can leave on an article.'''
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='comments')
    article = models.ForeignKey(Article, on_delete=models.CASCADE, related_name='comments')
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f'{self.user.username} - {self.article.title} - {self.content[:20]}'
