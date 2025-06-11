from django import forms
from .models import Colaborador
from django.contrib.auth.forms import AuthenticationForm

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
        self.fields['PIS'].required = False

class CPFLoginForm(AuthenticationForm):
    username = forms.CharField(
        label="CPF",
        widget=forms.TextInput(attrs={
            'placeholder': '000.000.000-00',
            'maxlength': '14',
            'id': 'cpf',  # usado no JS
            'autocomplete': 'username'
        })
    )
