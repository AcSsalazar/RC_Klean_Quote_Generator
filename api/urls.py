from django.urls import path
from .views import InvoiceCalculateView, OptionsView

urlpatterns = [
    # Ruta para obtener las opciones de negocio, áreas, y equipos
    path('invoice/', InvoiceCalculateView.as_view(), name='invoice'),
    path('options/', OptionsView.as_view(), name='options' ),
]