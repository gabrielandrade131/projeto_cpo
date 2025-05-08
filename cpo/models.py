from django.db import models

# Create your models here.

class Colaborador(models.Model):
    nome = models.CharField(max_length=255)
    cpf = models.CharField(max_length=14, unique=True)
    matricula = models.CharField(max_length=50)
    funcao = models.CharField(max_length=255)
    competencia = models.CharField(max_length=20)

    def __str__(self):
        return self.nome