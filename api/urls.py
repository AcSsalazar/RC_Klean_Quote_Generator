from django.urls import path
from .views import InvoiceCalculateView, OptionsView, InvoiceDetailView
from userauths import views as userauths_views
from rest_framework_simplejwt.views import TokenRefreshView
from forms import views as forms_views


urlpatterns = [
    # Invoice calculator API end points: para obtener las opciones de negocio, áreas, y equipos

    path('invoice/', InvoiceCalculateView.as_view(), name='invoice'),
    path('options/', OptionsView.as_view(), name='options' ),
    path('invoice/<int:pk>/', InvoiceDetailView.as_view(), name='invoice_detail'),

    path('', userauths_views.getRoutes),

    # Forms API endpoint:

    path('form/', forms_views.QuestionnaireSubmitView.as_view(), name='questionnaire-submit'),           # POST
    path('form/options/', forms_views.QuestionnaireOptionsView.as_view(), name='questionnaire-options'), # GET options
    path('form/<int:pk>/', forms_views.QuestionnaireDetailView.as_view(), name='questionnaire-detail'),  # GET details 

    # Userauths API Endpoints

    path('user/token/', userauths_views.MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('user/token/refresh', TokenRefreshView.as_view(), name='refresh_obtain_pair'),
    path('user/register/', userauths_views.RegisterView.as_view(), name='auth_register'),
    path('user/password-reset/<email>/', userauths_views.PasswordEmailVerify.as_view(), name='password_reset'),
    path('user/password-change/', userauths_views.PasswordChangeView.as_view(), name='password_change'),
    path('profile/<user_id>/', userauths_views.ProfileView.as_view(), name='user_profile'),
]