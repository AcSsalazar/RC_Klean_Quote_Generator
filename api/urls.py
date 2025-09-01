# api/urls.py
from django.urls import path
from userauths import views as userauths_views
from rest_framework_simplejwt.views import TokenRefreshView
from .views import (
    InvoiceCalculateView,
    InvoiceUpdateView,
    InvoiceDetailView,
    OptionsView,
    SavedQuotesView
    
)

urlpatterns = [
    path('invoice/', InvoiceCalculateView.as_view(), name='invoice-calculate'),  # POST
    path('invoice/<str:identifier>/update/', InvoiceUpdateView.as_view(), name='invoice-update'),  # PATCH
    path('invoice/<str:identifier>/', InvoiceDetailView.as_view(), name='invoice-detail'),  # GET
    path('options/', OptionsView.as_view(), name='options'),
    path('saved-quotes/', SavedQuotesView.as_view(), name='saved-quotes'),

    # User authentication endpoints

    path('user/token/', userauths_views.MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('user/token/refresh/', TokenRefreshView.as_view(), name='refresh_obtain_pair'),
    path('user/register/', userauths_views.RegisterView.as_view(), name='auth_register'),
    path('user/password-reset/<email>/', userauths_views.PasswordEmailVerify.as_view(), name='password_reset'),
    path('user/password-change/', userauths_views.PasswordChangeView.as_view(), name='password_change'),
    path('profile/<user_id>/', userauths_views.ProfileView.as_view(), name='user_profile'),
]