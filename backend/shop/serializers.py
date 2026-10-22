from rest_framework import serializers

from .models import Product, ProductImage, ProductSize


class ProductImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductImage
        fields = ["image", "caption", "order"]


class ProductSizeSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductSize
        fields = ["label", "stock"]


class ProductListSerializer(serializers.ModelSerializer):
    category = serializers.SlugRelatedField(slug_field="slug", read_only=True)
    sizes = ProductSizeSerializer(many=True, read_only=True)
    sold_out = serializers.SerializerMethodField()
    cover = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = ["slug", "sku", "title", "price", "category", "status", "sizes", "sold_out", "cover"]

    def get_sold_out(self, obj):
        return not any(size.stock > 0 for size in obj.sizes.all())

    def get_cover(self, obj):
        first = obj.images.first()
        return first.image.url if first and first.image else None
