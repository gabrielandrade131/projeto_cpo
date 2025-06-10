import csv
import datetime
from django.core.management.base import BaseCommand
from cpo.models import Colaborador
from unidecode import unidecode
from django.db import IntegrityError
from django.contrib.auth.models import User

class Command(BaseCommand):
    help = 'Importa colaboradores de um arquivo CSV'

    def add_arguments(self, parser):
        parser.add_argument('csvfile', type=str)

    def handle(self, *args, **kwargs):
        with open(kwargs['csvfile'], newline='', encoding='utf-8') as csvfile:
            reader = csv.DictReader(csvfile, delimiter=';')
            for row in reader:
                row = {unidecode(k.strip()).upper(): v for k, v in row.items()}
                try:
                    admissao_valor = row.get('ADMISSAO')
                    data_admissao = None
                    if admissao_valor:
                        try:
                            data_admissao = datetime.datetime.strptime(admissao_valor, "%d/%m/%Y").date()
                        except Exception:
                            data_admissao = None
                    else:
                        data_admissao = None

                    colaborador, _ = Colaborador.objects.update_or_create(
                        cpf=row['CPF'],
                        defaults={
                            'nome': row['NOME'],
                            'matricula': row['MATRICULA'],
                            'funcao': row['FUNCAO'],
                            'PIS': row.get('PIS'),
                            'data_admissao': data_admissao,
                            'email': row.get('EMAIL') or None,
                            'ctps': row.get('CTPS') or row.get('NOCTPS') or row.get('NO CTPS'),
                        }
                    )
                    # Cria usuário Django se não existir e CPF não está vazio
                    username = row['CPF']
                    if username and not User.objects.filter(username=username).exists():
                        User.objects.create_user(
                            username=username,
                            password='12345',
                            email=row.get('EMAIL') or '',
                            first_name=row['NOME']
                        )
                except IntegrityError:
                    print(f"Registro com e-mail {row.get('EMAIL')} já existe. Pulando.")
        self.stdout.write(self.style.SUCCESS('Colaboradores e usuários importados com sucesso!'))