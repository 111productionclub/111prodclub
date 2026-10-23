from rest_framework import generics

from .models import Case
from .serializers import CaseDetailSerializer, CaseListSerializer


class CaseListView(generics.ListAPIView):
    serializer_class = CaseListSerializer

    def get_queryset(self):
        queryset = Case.objects.filter(is_published=True).prefetch_related("images")
        category = self.request.query_params.get("category")
        if category:
            queryset = queryset.filter(category=category)
        return queryset


class CaseDetailView(generics.RetrieveAPIView):
    serializer_class = CaseDetailSerializer
    lookup_field = "slug"
    queryset = Case.objects.filter(is_published=True).prefetch_related("images", "metrics")
