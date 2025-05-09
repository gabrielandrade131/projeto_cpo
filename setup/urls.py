"""
URL configuration for setup project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
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
]
