from django.contrib import admin
from django.utils.html import format_html

from .models import Case, CaseImage, CaseMetric


class CaseImageInline(admin.TabularInline):
    model = CaseImage
    extra = 1
    fields = ("preview", "image", "caption", "order")
    readonly_fields = ("preview",)

    @admin.display(description="превью")
    def preview(self, obj):
        if not obj.pk or not obj.widths:
            return "—"
        name, _ = obj.variants()[0]
        return format_html('<img src="{}" style="height:64px;border-radius:4px">', obj.image.storage.url(name))


class CaseMetricInline(admin.TabularInline):
    model = CaseMetric
    extra = 0


@admin.register(Case)
class CaseAdmin(admin.ModelAdmin):
    list_display = ("title", "number", "category", "year", "order", "is_published")
    list_editable = ("order", "is_published")
    list_filter = ("category", "is_published")
    search_fields = ("title", "summary")
    prepopulated_fields = {"slug": ("title",)}
    inlines = [CaseImageInline, CaseMetricInline]
    fieldsets = [
        (None, {"fields": ["title", "slug", "number", "kind", "category", "year", "order", "is_published"]}),
        ("Карточка на /works", {"fields": ["summary", "tags"]}),
        ("Страница кейса", {"fields": ["client", "work", "duration", "url", "video", "task", "solution"]}),
        ("Цитата", {"fields": ["quote_text", "quote_author"], "classes": ["collapse"]}),
    ]
