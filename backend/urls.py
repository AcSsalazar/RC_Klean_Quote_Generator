from django.contrib import admin
from django.urls import path, include
from userauths import views as userauths_views
from rest_framework_simplejwt.views import TokenRefreshView
from django.conf.urls.static import static
from django.conf import settings


# drf-yasg imports
from rest_framework import permissions
from drf_yasg.views import get_schema_view
from drf_yasg import openapi
from userauths import views as userauths_views
#Para agilizar redaccion de documentacion del backend
schema_view = get_schema_view(
   openapi.Info(
      title="RC Klean App Documentation",
      default_version='v1',
      description="Documentación Bacekend API",
      terms_of_service="https://www.google.com/policies/terms/",
      contact=openapi.Contact(email="acsalazar@unal.edu.co"),
      license=openapi.License(name="BSD License"),
   ),
   public=True,
   permission_classes=(permissions.AllowAny,),
)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('api.urls')),
    path('', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
            # Userauths API Endpoints
    path('user/token/', userauths_views.MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('user/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('user/register/', userauths_views.RegisterView.as_view(), name='auth_register'),
    path('user/profile/<user_id>/', userauths_views.ProfileView.as_view(), name='user_profile'),
    path('user/test/', userauths_views.testEndPoint, name='auth_register'),
    path('user/password-reset/<email>/', userauths_views.PasswordEmailVerify.as_view(), name='password_reset'),
    path('user/password-change/', userauths_views.PasswordChangeView.as_view(), name='password_change'),

]

urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)