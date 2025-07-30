# backend/urls.py
from django.contrib import admin
from django.urls import path, include
from django.conf.urls.static import static
from django.conf import settings

# Swagger docs
from rest_framework import permissions
from drf_yasg.views import get_schema_view
from drf_yasg import openapi

schema_view = get_schema_view(
    openapi.Info(
        title="RC Klean App Documentation",
        default_version='v1.0',
        description="Documentación Backend API",
        terms_of_service="https://www.google.com/policies/terms/",
        contact=openapi.Contact(email="acsalazar@unal.edu.co"),
        license=openapi.License(name="BSD License"),
    ),
    public=True,
    permission_classes=(permissions.AllowAny,),
)

urlpatterns = [
    path('admin/', admin.site.urls),

    # Modular includes
    path('api/', include('api.urls')),
    path('userauths/', include('userauths.urls')),

    # Swagger UI
    path('', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
]

# Static and media files
urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)