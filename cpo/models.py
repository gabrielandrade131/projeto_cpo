from django.db import models
from django.core.exceptions import ValidationError
import re

# Função para validar o CPF
def validar_cpf(cpf):
    # Regex simples para verificar se o CPF tem o formato correto
    if not re.match(r'^\d{3}\.\d{3}\.\d{3}-\d{2}$', cpf):
        raise ValidationError("CPF com formato inválido. Use o formato XXX.XXX.XXX-XX")

class Colaborador(models.Model):
    nome = models.CharField(max_length=255)
    cpf = models.CharField(max_length=14, unique=True, validators=[validar_cpf])  # Validação de CPF
    matricula = models.CharField(max_length=50)
    funcao = models.CharField(max_length=255)
    competencia = models.CharField(max_length=20)

    def __str__(self):
        return self.nome

    # Método para formatar o CPF para o formato XXX.XXX.XXX-XX
    def formatar_cpf(self):
        return f'{self.cpf[:3]}.{self.cpf[3:6]}.{self.cpf[6:9]}-{self.cpf[9:]}'
    
    class Meta:
        ordering = ['nome']  # Ordena a lista de colaboradores por nome por padrão
