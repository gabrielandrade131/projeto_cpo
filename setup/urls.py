from django.contrib import admin
from django.urls import path, include
from cpo import views

urlpatterns = [
    path('', views.home, name='home'),  # Redireciona para login
    path('admin/', admin.site.urls),
    path('', include('django.contrib.auth.urls')),  # Inclui as views de login/logout (login, logout, etc.)
    path('dashboard/', views.dashboard, name='dashboard'),  # Página do dashboard, acessível para usuários logados
    path('register/', views.register, name='register'),  # URL para o cadastro de usuário
    path('salvar_colaborador/', views.salvar_colaborador, name='salvar_colaborador'),  # URL para salvar colaborador
    # A rota para o formulário de colaboradores, se necessário
    # path('colaboradores/', views.listar_colaboradores, name='listar_colaboradores'),
]
