from django import forms
from .models import Colaborador

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
