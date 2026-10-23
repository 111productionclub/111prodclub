from django.urls import path

from .views import CaseDetailView, CaseListView

urlpatterns = [
    path("cases/", CaseListView.as_view()),
    path("cases/<slug:slug>/", CaseDetailView.as_view()),
]
