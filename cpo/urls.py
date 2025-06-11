from django.urls import path, include
from cpo import views
from django.shortcuts import redirect

urlpatterns = [
    path('', lambda request: redirect('login'), name='home'),
    path('salvar-folha-ponto/', views.salvar_folha_ponto, name='salvar_folha_ponto'),
    path('dashboard/', views.dashboard, name='dashboard'),
    path('', include('django.contrib.auth.urls')),
]