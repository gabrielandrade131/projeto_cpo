from django.urls import path
from .views import registrar_colaborador
from cpo import views
from django.shortcuts import redirect

urlpatterns = [
    path('registrar/', registrar_colaborador, name='registrar_colaborador'),
    path('salvar-folha-ponto/', views.salvar_folha_ponto, name='salvar_folha_ponto'),
    path('dashboard/operacional/', views.dashboard_operacional, name='dashboard_operacional'),
    path('dashboard/backoffice/', views.dashboard_backoffice, name='dashboard_backoffice'),
]

def pos_login_redirect(request):
    if request.user.colaborador.tipo == 'operacional':
        return redirect('dashboard_operacional')
    else:
        return redirect('dashboard_backoffice')

<script>
// ...existing code...

function coletarDadosTabela() {
    const dados = [];
    document.querySelectorAll('#tabela-dias tr').forEach(tr => {
        const linha = Array.from(tr.querySelectorAll('input')).map(input => input.value);
        dados.push(linha);
    });
    return dados;
}

function salvarDados() {
    salvarTabelaLocal(); // Salva localmente também
    const competencia = document.getElementById('competencia').value;
    const nome = document.getElementById('nome').value;
    const cpf = document.getElementById('cpf').value;
    const matricula = document.getElementById('matricula').value;
    const funcao = document.getElementById('funcao').value;
    const tabela = coletarDadosTabela();

    fetch('/salvar-folha-ponto/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            // Se usar CSRF, inclua o token aqui
        },
        body: JSON.stringify({
            competencia, nome, cpf, matricula, funcao, tabela
        })
    })
    .then(response => {
        if (response.ok) {
            alert('Dados enviados para o painel adm!');
        } else {
            alert('Erro ao enviar dados!');
        }
    });
}
</script>