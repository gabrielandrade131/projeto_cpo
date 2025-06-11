from django.db import models
from django.core.exceptions import ValidationError
import re
from django.contrib.auth.models import User

def validar_cpf(cpf):
    if not re.match(r'^\d{3}\.\d{3}\.\d{3}-\d{2}$', cpf):
        raise ValidationError("CPF com formato inválido. Use o formato XXX.XXX.XXX-XX")

class Colaborador(models.Model):
    TIPO_CHOICES = [
        ('backoffice', 'Backoffice'),
        ('operacional', 'Operacional'),
    ]
    nome = models.CharField(max_length=150)
    email = models.EmailField(blank=True, null=True)
    tipo = models.CharField(max_length=20, choices=TIPO_CHOICES, default='backoffice')
    cpf = models.CharField(max_length=14, validators=[validar_cpf])
    matricula = models.CharField(max_length=50)
    funcao = models.CharField(max_length=255)
    PIS = models.CharField(max_length=50, blank=True, null=True)
    data_admissao = models.DateField(null=True, blank=True, verbose_name="Data de Admissão")
    ctps = models.CharField(max_length=20, blank=True, null=True, verbose_name="Nº CTPS")
    user = models.OneToOneField(User, on_delete=models.SET_NULL, null=True, blank=True)

    def __str__(self):
        return self.nome

    class Meta:
        ordering = ['nome']

class FolhaPonto(models.Model):
    nome = models.CharField(max_length=255)
    cpf = models.CharField(max_length=20)
    matricula = models.CharField(max_length=50)
    funcao = models.CharField(max_length=100)
    competencia = models.CharField(max_length=20)
    tabela = models.JSONField()

    def __str__(self):
        return f"{self.nome} - {self.competencia}"
