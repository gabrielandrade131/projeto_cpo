from django.shortcuts import render, redirect
from django.contrib.auth.forms import UserCreationForm
from django.contrib import messages
from django.contrib.auth.decorators import login_required
from .forms import CustomUserCreationForm
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .models import Colaborador
import json

# View para redirecionar para login
def home(request):
    return redirect('login')


# View para o dashboard, apenas acessível para usuários autenticados
@login_required
def dashboard(request):
    return render(request, 'dashboard.html', {'user': request.user})

# View para o cadastro de usuário
def register(request):
    if request.method == 'POST':
        form = UserCreationForm(request.POST)
        if form.is_valid():
            form.save()
            messages.success(request, 'Cadastro realizado com sucesso! Você já pode fazer login.')
            return redirect('login')
        else:
            messages.error(request, 'Erro ao cadastrar. Verifique os dados e tente novamente.')
    else:
        form = UserCreationForm()

    return render(request, 'registration/register.html', {'form': form})

@csrf_exempt
def salvar_colaborador(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            colaborador = Colaborador.objects.create(
                nome=data['nome'],
                cpf=data['cpf'],
                matricula=data['matricula'],
                funcao=data['funcao'],
                competencia=data['competencia']
            )
            return JsonResponse({'mensagem': 'Dados salvos com sucesso!'}, status=201)
        except Exception as e:
            return JsonResponse({'erro': str(e)}, status=400)
    return JsonResponse({'erro': 'Método não permitido'}, status=405)
