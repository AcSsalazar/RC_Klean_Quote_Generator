from django.urls import path
from .views import InvoiceCalculateView, OptionsView, InvoiceDetailView

urlpatterns = [
    # Ruta para obtener las opciones de negocio, áreas, y equipos
    path('invoice/', InvoiceCalculateView.as_view(), name='invoice'),
    path('options/', OptionsView.as_view(), name='options' ),
    path('invoices/<int:pk>/', InvoiceDetailView.as_view(), name='invoice_detail'),
]