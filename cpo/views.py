from django.shortcuts import render, redirect
from django.contrib.auth.forms import UserCreationForm
from django.contrib import messages
from django.contrib.auth.decorators import login_required
from .forms import CustomUserCreationForm  # Se você tiver criado um formulário customizado

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
