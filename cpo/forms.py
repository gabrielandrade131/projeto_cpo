from django import forms
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth.models import User

# Formulário de Cadastro
class CustomUserCreationForm(UserCreationForm):
    email = forms.EmailField(required=True)

    class Meta:
        model = User
        fields = ['username', 'email', 'password1', 'password2']
