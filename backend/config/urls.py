from django.conf import settings
from django.conf.urls.static import static
from django.urls import include, path
from django.contrib import admin

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/", include("shop.urls")),
    path("api/", include("cases.urls")),
]

# Локально Django сам отдаёт /media/. На сервере это делает Caddy
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
