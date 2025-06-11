from django.urls import path, include
from cpo import views
from django.shortcuts import redirect
from django.contrib.auth.views import LoginView
from .forms import CPFLoginForm

urlpatterns = [
    path('', lambda request: redirect('login'), name='home'),
    path('salvar-folha-ponto/', views.salvar_folha_ponto, name='salvar_folha_ponto'),
    path('dashboard/', views.dashboard, name='dashboard'),

    path('login/', LoginView.as_view(
        template_name='registration/login.html',
        authentication_form=CPFLoginForm
    ), name='login'),

    path('', include('django.contrib.auth.urls')),
]
