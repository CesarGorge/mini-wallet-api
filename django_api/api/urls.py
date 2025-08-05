from django.urls import path
from .views import TransactionCreateView, HomeView

urlpatterns = [
    path('', HomeView.as_view(), name='home'),
    path('transactions/', TransactionCreateView.as_view(), name='create-transaction'),
]