from django import forms
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth.models import User
from .models import Colaborador

# Formulário de Cadastro
class CustomUserCreationForm(UserCreationForm):
    email = forms.EmailField(required=True)

    username = forms.CharField(max_length=150, help_text="")

    class Meta:
        model = User
        fields = ['username', 'email', 'password1', 'password2']

class ColaboradorForm(forms.ModelForm):
    class Meta:
        model = Colaborador
        fields = [
            'nome', 'email', 'tipo', 'cpf', 'matricula', 'funcao', 'PIS', 'data_admissao', 'ctps'
        ]
        widgets = {
            'data_admissao': forms.DateInput(attrs={'type': 'date'}),
        }

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        # PIS só obrigatório para operacional
        self.fields['PIS'].required = False

class UsuarioColaboradorForm(UserCreationForm):
    nome = forms.CharField(max_length=150)
    email = forms.EmailField(required=True)
    tipo = forms.ChoiceField(choices=Colaborador.TIPO_CHOICES)
    cpf = forms.CharField(max_length=14)
    matricula = forms.CharField(max_length=50)
    funcao = forms.CharField(max_length=255)
    PIS = forms.CharField(max_length=50, required=False)
    data_admissao = forms.CharField(max_length=20)

    class Meta(UserCreationForm.Meta):
        model = User
        fields = ['username', 'email', 'password1', 'password2', 'nome', 'tipo', 'cpf', 'matricula', 'funcao', 'PIS', 'data_admissao']
