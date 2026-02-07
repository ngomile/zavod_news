from django.contrib import admin

from .models import (
    Article,
    ArticleImage,
    Tag,
    Reaction,
    Comment
)


class ArticleImageInline(admin.TabularInline):
    model = ArticleImage


class ReactionsInline(admin.TabularInline):
    model = Reaction


@admin.register(Article)
class ArticleAdmin(admin.ModelAdmin):
    inlines = [
        ArticleImageInline,
        ReactionsInline,
    ]


@admin.register(Tag)
class TagAdmin(admin.ModelAdmin):
    pass


@admin.register(Reaction)
class ReactionAdmin(admin.ModelAdmin):
    pass

@admin.register(Comment)
class CommentAdmin(admin.ModelAdmin):
    pass
