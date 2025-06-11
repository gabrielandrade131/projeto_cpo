from django.shortcuts import render, redirect
from django.contrib import messages
from django.contrib.auth.decorators import login_required
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .models import Colaborador, FolhaPonto
import json

def home(request):
    return redirect('login')

@login_required
def dashboard(request):
    try:
        colaborador = Colaborador.objects.get(cpf=request.user.username)
    except Colaborador.DoesNotExist:
        colaborador = None
    return render(request, 'dashboard.html', {'colaborador': colaborador})

@csrf_exempt
def salvar_colaborador(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)

            if len(data['cpf']) != 11:
                return JsonResponse({'erro': 'CPF inválido!'}, status=400)

            if Colaborador.objects.filter(matricula=data['matricula']).exists():
                return JsonResponse({'erro': 'Matrícula já cadastrada!'}, status=400)

            colaborador = Colaborador.objects.create(
                nome=data['nome'],
                cpf=data['cpf'],
                matricula=data['matricula'],
                funcao=data['funcao'],
                competencia=data['competencia']
            )

            return JsonResponse({'mensagem': 'Dados salvos com sucesso!'}, status=201)
        
        except KeyError as e:
            return JsonResponse({'erro': f'Campo {e} ausente!'}, status=400)
        
        except Exception as e:
            return JsonResponse({'erro': str(e)}, status=400)
    return JsonResponse({'erro': 'Método não permitido'}, status=405)

@csrf_exempt
def salvar_folha_ponto(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        FolhaPonto.objects.create(
            nome=data.get('nome', ''),
            cpf=data.get('cpf', ''),
            matricula=data.get('matricula', ''),
            funcao=data.get('funcao', ''),
            competencia=data.get('competencia', ''),
            tabela=data.get('tabela', []),
        )
        return JsonResponse({'status': 'ok'})
    return JsonResponse({'error': 'Método não permitido'}, status=405)
