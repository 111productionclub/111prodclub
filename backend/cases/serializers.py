from rest_framework import serializers

from .models import Case, CaseImage, CaseMetric


class CaseImageSerializer(serializers.ModelSerializer):
    # Пути относительные (/media/...): адрес сервера с картинками подставляет фронт
    src = serializers.SerializerMethodField()
    srcset = serializers.SerializerMethodField()

    class Meta:
        model = CaseImage
        fields = ["src", "srcset", "width", "height", "caption"]

    def get_src(self, obj):
        return obj.image.url

    def get_srcset(self, obj):
        return ", ".join(f"{obj.image.storage.url(name)} {width}w" for name, width in obj.variants())


class CaseMetricSerializer(serializers.ModelSerializer):
    class Meta:
        model = CaseMetric
        fields = ["value", "label"]


class CaseListSerializer(serializers.ModelSerializer):
    tags = serializers.ListField(source="tag_list", read_only=True)
    cover = serializers.SerializerMethodField()

    class Meta:
        model = Case
        fields = ["slug", "number", "title", "kind", "category", "year", "summary", "tags", "cover"]

    def get_cover(self, obj):
        first = next(iter(obj.images.all()), None)
        return CaseImageSerializer(first).data if first else None


class CaseDetailSerializer(CaseListSerializer):
    images = CaseImageSerializer(many=True, read_only=True)
    metrics = CaseMetricSerializer(many=True, read_only=True)
    quote = serializers.SerializerMethodField()

    class Meta(CaseListSerializer.Meta):
        fields = CaseListSerializer.Meta.fields + [
            "client", "work", "duration", "url", "task", "solution", "images", "metrics", "quote",
        ]

    def get_quote(self, obj):
        if not obj.quote_text:
            return None
        return {"text": obj.quote_text, "author": obj.quote_author}
