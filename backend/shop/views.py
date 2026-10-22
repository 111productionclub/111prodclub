from rest_framework import generics

from .models import Product
from .serializers import ProductDetailSerializer, ProductListSerializer


class ProductListView(generics.ListAPIView):
    serializer_class = ProductListSerializer

    def get_queryset(self):
        queryset = Product.objects.select_related("category").prefetch_related("sizes", "images")
        category = self.request.query_params.get("category")
        if category:
            queryset = queryset.filter(category__slug=category)
        return queryset


class ProductDetailView(generics.RetrieveAPIView):
    serializer_class = ProductDetailSerializer
    lookup_field = "slug"
    queryset = Product.objects.select_related("category").prefetch_related("sizes", "images")
