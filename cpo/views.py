from django.shortcuts import render, redirect
from django.contrib.auth.forms import UserCreationForm
from django.contrib import messages
from django.contrib.auth.decorators import login_required
from .forms import CustomUserCreationForm  # Formulário personalizado
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

# View para o cadastro de usuário utilizando o formulário customizado
def register(request):
    if request.method == 'POST':
        form = CustomUserCreationForm(request.POST)  # Usando o formulário personalizado
        if form.is_valid():
            form.save()
            messages.success(request, 'Cadastro realizado com sucesso! Você já pode fazer login.')
            return redirect('login')  # Redirecionar para a página de login
        else:
            messages.error(request, 'Erro ao cadastrar. Verifique os dados e tente novamente.')
    else:
        form = CustomUserCreationForm()  # Usando o formulário personalizado

    return render(request, 'registration/register.html', {'form': form})

# Endpoint para salvar dados de um colaborador via requisição POST
@csrf_exempt
def salvar_colaborador(request):
    if request.method == 'POST':
        try:
            # Carregar os dados JSON da requisição
            data = json.loads(request.body)

            # Validar dados - por exemplo, verificar se o CPF é válido ou se já existe no sistema
            if len(data['cpf']) != 11:  # Exemplo de validação simples para CPF
                return JsonResponse({'erro': 'CPF inválido!'}, status=400)

            # Verificar se a matrícula já existe
            if Colaborador.objects.filter(matricula=data['matricula']).exists():
                return JsonResponse({'erro': 'Matrícula já cadastrada!'}, status=400)

            # Criar o colaborador no banco de dados
            colaborador = Colaborador.objects.create(
                nome=data['nome'],
                cpf=data['cpf'],
                matricula=data['matricula'],
                funcao=data['funcao'],
                competencia=data['competencia']
            )

            # Retornar resposta positiva com status 201 (Criado)
            return JsonResponse({'mensagem': 'Dados salvos com sucesso!'}, status=201)
        
        except KeyError as e:
            # Caso falte algum dado obrigatório no JSON
            return JsonResponse({'erro': f'Campo {e} ausente!'}, status=400)
        
        except Exception as e:
            # Para outros erros não previstos
            return JsonResponse({'erro': str(e)}, status=400)
    return JsonResponse({'erro': 'Método não permitido'}, status=405)
