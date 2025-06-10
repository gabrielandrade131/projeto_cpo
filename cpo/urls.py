from django.urls import path
from .views import registrar_colaborador
from cpo import views
from django.shortcuts import redirect

urlpatterns = [
    path('registrar/', registrar_colaborador, name='registrar_colaborador'),
    path('salvar-folha-ponto/', views.salvar_folha_ponto, name='salvar_folha_ponto'),
    path('dashboard/', views.dashboard, name='dashboard'),  # Unificado
]

def pos_login_redirect(request):
    return redirect('dashboard')