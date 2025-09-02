from django.contrib import admin
from django.urls import path, include, re_path
from django.views.generic import TemplateView
from userauths import views as userauths_views
from rest_framework_simplejwt.views import TokenRefreshView
from django.conf.urls.static import static
from django.conf import settings
from pathlib import Path
import os
# drf-yasg imports
from rest_framework import permissions
from drf_yasg.views import get_schema_view
from drf_yasg import openapi
from api import views as invoiceviews

# --------------------------------------------------------------------------------------
# BASE DIRECTORIES
# --------------------------------------------------------------------------------------
BASE_DIR = Path(__file__).resolve().parent.parent

#Para agilizar redaccion de documentacion del backend
schema_view = get_schema_view(
        openapi.Info(
                title="RC Klean App Documentation",
                default_version='v1.0',
                description="Documentación Bacekend API",
                terms_of_service="https://www.google.com/policies/terms/",
                contact=openapi.Contact(email="acsalazar@unal.edu.co"),
                license=openapi.License(name="BSD License"),
        ),
        public=True,
        permission_classes=(permissions.AllowAny,),
        )

urlpatterns = [
        # Admin and documentations URL's
        path('admin/', admin.site.urls),
        path('api/', include('api.urls')),
        path('swagger/', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),


        # User authentication URL's
   
        path('api/auth/token/', userauths_views.MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
        path('api/auth/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
        path('api/auth/register/', userauths_views.RegisterView.as_view(), name='auth_register'),
        path('api/auth/profile/<int:user_id>/', userauths_views.ProfileView.as_view(), name='user_profile'),
        path('api/auth/password-reset/<email>/', userauths_views.PasswordEmailVerify.as_view(), name='password_reset'),
        path('api/auth/password-change/', userauths_views.PasswordChangeView.as_view(), name='password_change'),
        path('api/auth/test/', userauths_views.testEndPoint, name='auth_test'),

]

# Sirve archivos estáticos en modo DEBUG
if settings.DEBUG:
        urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
        urlpatterns += static(settings.STATIC_URL, document_root=os.path.join(BASE_DIR, "frontend/dist/assets"))

# Ruta para servir index.html
urlpatterns += [
        re_path(r'^.*$', TemplateView.as_view(template_name='index.html'), name='react-app'),
]