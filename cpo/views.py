from django.shortcuts import render, redirect
from django.contrib.auth.forms import UserCreationForm
from django.contrib import messages
from django.contrib.auth.decorators import login_required
from .forms import CustomUserCreationForm, ColaboradorForm, UsuarioColaboradorForm
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .models import Colaborador, FolhaPonto
import json

# View para redirecionar para login
def home(request):
    return redirect('login')

# View para o dashboard, apenas acessível para usuários autenticados
@login_required
def dashboard(request):
    try:
        colaborador = Colaborador.objects.get(cpf=request.user.username)
    except Colaborador.DoesNotExist:
        colaborador = None
    return render(request, 'dashboard.html', {'colaborador': colaborador})

# View para o cadastro de usuário utilizando o formulário customizado
def register(request):
    if request.method == 'POST':
        form = UsuarioColaboradorForm(request.POST)
        if form.is_valid():
            cpf = form.cleaned_data['cpf']
            try:
                colaborador = Colaborador.objects.get(cpf=cpf)
                user = form.save(commit=False)
                user.email = form.cleaned_data['email']
                user.save()
                colaborador.user = user
                colaborador.save()
                messages.success(request, 'Cadastro realizado com sucesso! Você já pode fazer login.')
                return redirect('login')
            except Colaborador.DoesNotExist:
                form.add_error('cpf', 'Colaborador não encontrado. Verifique seu CPF.')
    else:
        form = UsuarioColaboradorForm()
    return render(request, 'registration/register.html', {'form': form})

# View para o registro de colaboradores
def registrar_colaborador(request):
    if request.method == 'POST':
        form = ColaboradorForm(request.POST)
        if form.is_valid():
            colaborador = form.save(commit=False)
            # Torna PIS obrigatório apenas para operacional
            if colaborador.tipo == 'operacional' and not colaborador.PIS:
                form.add_error('PIS', 'O campo PIS é obrigatório para colaborador operacional.')
            else:
                colaborador.save()
                messages.success(request, 'Colaborador cadastrado com sucesso!')
                return redirect('login')
    else:
        form = ColaboradorForm()
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
