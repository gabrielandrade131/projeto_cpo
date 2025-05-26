from django.db import models
from django.core.exceptions import ValidationError
import re

# Função para validar o CPF
def validar_cpf(cpf):
    # Regex simples para verificar se o CPF tem o formato correto
    if not re.match(r'^\d{3}\.\d{3}\.\d{3}-\d{2}$', cpf):
        raise ValidationError("CPF com formato inválido. Use o formato XXX.XXX.XXX-XX")

MESES = [
    ('janeiro', 'Janeiro'),
    ('fevereiro', 'Fevereiro'),
    ('março', 'Março'),
    # ...outros meses...
    ('dezembro', 'Dezembro'),
]

class Colaborador(models.Model):
    TIPO_CHOICES = [
        ('backoffice', 'Backoffice'),
        ('operacional', 'Operacional'),
    ]
    nome = models.CharField(max_length=150)
    email = models.EmailField(unique=True, default='exemplo@dominio.com')
    tipo = models.CharField(max_length=20, choices=TIPO_CHOICES, default='backoffice')
    # Campos comuns
    cpf = models.CharField(max_length=14, validators=[validar_cpf])
    matricula = models.CharField(max_length=50)
    funcao = models.CharField(max_length=255)
    # Campos específicos
    PIS = models.CharField(max_length=50, blank=True, null=True)
    data_admissao = models.CharField(max_length=20, choices=MESES, default='março')
    

    def __str__(self):
        return self.nome

    class Meta:
        ordering = ['nome']

class FolhaDePonto(models.Model):
    colaborador = models.ForeignKey(Colaborador, on_delete=models.CASCADE)
    competencia = models.CharField(max_length=20)

class FolhaPonto(models.Model):
    nome = models.CharField(max_length=255)
    cpf = models.CharField(max_length=20)
    matricula = models.CharField(max_length=50)
    funcao = models.CharField(max_length=100)
    competencia = models.CharField(max_length=20)
    tabela = models.JSONField()  # Salva a tabela como JSON

    def __str__(self):
        return f"{self.nome} - {self.competencia}"
