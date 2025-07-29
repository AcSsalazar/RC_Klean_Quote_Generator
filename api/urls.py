# api/urls.py
from django.urls import path
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
]
