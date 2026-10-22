from django.contrib import admin

from .models import Category, Product, ProductImage, ProductSize


class ProductImageInline(admin.TabularInline):
    model = ProductImage
    extra = 1


class ProductSizeInline(admin.TabularInline):
    model = ProductSize
    extra = 1


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    prepopulated_fields = {"slug": ("title",)}


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ("title", "sku", "price", "status", "category")
    list_filter = ("status", "category")
    prepopulated_fields = {"slug": ("title",)}
    inlines = [ProductImageInline, ProductSizeInline]
