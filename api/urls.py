from django.urls import path
from userauths import views as userauths_views
from rest_framework_simplejwt.views import TokenRefreshView
from .views import (InvoiceCalculateView, OptionsView, 
                    SavedQuotesView, InvoiceDetailView)


urlpatterns = [
    # Invoice calculator API end points: para obtener las opciones de negocio, áreas, y equipos

    path('invoice/', InvoiceCalculateView.as_view(), name='invoice-calculate'),
    path('invoice/<str:identifier>/', InvoiceDetailView.as_view(), name='invoice_detail'),
    path('options/', OptionsView.as_view(), name='options' ),

    


    path('invoice/', InvoiceCalculateView.as_view(), name='invoice-calculate'),  # POST
    path('invoice/<str:identifier>/update/', InvoiceCalculateView.as_view(), name='invoice-update'),  # PATCH
    path('invoice/<str:identifier>/', InvoiceDetailView.as_view(), name='invoice-detail'),  # GET


    path('saved-quotes/', SavedQuotesView.as_view(), name='saved_quotes'),



   
    
    
    # Userauths API Endpoints

    path('user/token/', userauths_views.MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('user/token/refresh', TokenRefreshView.as_view(), name='refresh_obtain_pair'),
    path('user/register/', userauths_views.RegisterView.as_view(), name='auth_register'),
    path('user/password-reset/<email>/', userauths_views.PasswordEmailVerify.as_view(), name='password_reset'),
    path('user/password-change/', userauths_views.PasswordChangeView.as_view(), name='password_change'),
    path('profile/<user_id>/', userauths_views.ProfileView.as_view(), name='user_profile'),
    
]