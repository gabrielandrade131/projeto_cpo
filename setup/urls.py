from django.contrib import admin
from django.urls import path, include
from cpo import views

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('django.contrib.auth.urls')),  # Inclua antes da home
    path('', views.home, name='home'),
    path('dashboard/', views.dashboard, name='dashboard'),  # Página do dashboard, acessível para usuários logados
    path('dashboard/operacional/', views.dashboard_operacional, name='dashboard_operacional'),
    path('dashboard/backoffice/', views.dashboard_backoffice, name='dashboard_backoffice'),
    path('register/', views.register, name='register'),  # URL para o cadastro de usuário
    path('salvar_colaborador/', views.salvar_colaborador, name='salvar_colaborador'),  # URL para salvar colaborador
    # A rota para o formulário de colaboradores, se necessário
    # path('colaboradores/', views.listar_colaboradores, name='listar_colaboradores'),
]
