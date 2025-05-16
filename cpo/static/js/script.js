const meses = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];

function atualizarDias() {
    const mesIndex = document.getElementById('competencia').value - 1;
    const diasNoMes = new Date(2025, mesIndex + 1, 0).getDate();
    const tbody = document.getElementById('tabela-dias');
    tbody.innerHTML = '';

    document.getElementById('competencia-display').innerText = meses[mesIndex];

    const dadosSalvos = JSON.parse(localStorage.getItem('folhaDePonto')) || { dias: [] };

    const diasSemana = ["Domingo", "Segunda-feira", "Terça-feira", "Quarta-feira", "Quinta-feira", "Sexta-feira", "Sábado"];

    for (let dia = 1; dia <= diasNoMes; dia++) {
        const data = new Date(2025, mesIndex, dia);
        const diaSemana = diasSemana[data.getDay()];
        const observacao = dadosSalvos.dias.find(d => d.dia == dia)?.observacao || '';
        const entrada = dadosSalvos.dias.find(d => d.dia == dia)?.entrada || '';
        const inicioIntervalo = dadosSalvos.dias.find(d => d.dia == dia)?.inicioIntervalo || '';
        const fimIntervalo = dadosSalvos.dias.find(d => d.dia == dia)?.fimIntervalo || '';
        const saida = dadosSalvos.dias.find(d => d.dia == dia)?.saida || '';
        const rdo = dadosSalvos.dias.find(d => d.dia == dia)?.rdo || '';
        const regime = dadosSalvos.dias.find(d => d.dia == dia)?.regime || '';
        const horaExtra = dadosSalvos.dias.find(d => d.dia == dia)?.horaExtra || '';
        const assinatura = dadosSalvos.dias.find(d => d.dia == dia)?.assinatura || '';

        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${dia} - ${diaSemana}</td>
            <td class="entrada"><input type="text" class="hora-input" placeholder="00:00" value="${entrada}"></td>
            <td class="inicio-intervalo"><input type="text" class="hora-input" placeholder="00:00" value="${inicioIntervalo}"></td>
            <td class="fim-intervalo"><input type="text" class="hora-input" placeholder="00:00" value="${fimIntervalo}"></td>
            <td class="saida"><input type="text" class="hora-input" placeholder="00:00" value="${saida}"></td>
            <td class="rdo"><input type="text" class="rdo-input" placeholder="" value="${rdo}"></td>
            <td class="regime"><input type="text" class="regime-input" placeholder="ON/OFF" value="${regime}"></td>
            <td class="hora-extra"><input type="text" class="hora-extra-input" placeholder="00:00" value="${horaExtra}"></td>
            <td class="observacao"><input type="text" id="observacao-${dia}" value="${observacao}" onblur="salvarObservacao(${dia})"></td>
            <td class="assinatura"><input type="text" class="assinatura-input" placeholder="" value="${assinatura}"></td>
        `;
        tbody.appendChild(tr);
    }

    adicionarEventosCalculoCargaHoraria();
}

function adicionarEventosCalculoCargaHoraria() {
    const inputs = document.querySelectorAll('#tabela-dias input.hora-input');

    inputs.forEach((input) => {
        input.addEventListener('input', () => {
            input.value = input.value.replace(/[^0-9:]/g, '');

            const regexHora = /^([0-9]|[0-1][0-9]|2[0-3]):([0-5][0-9])$/;
            if (!regexHora.test(input.value) && input.value !== '') {
                input.classList.add('invalid');
            } else {
                input.classList.remove('invalid');
                input.value = normalizarHora(input.value);
                calcularHorasTrabalhadas();
            }
        });
    });
}

function normalizarHora(hora) {
    hora = hora.replace(/\D/g, '');

    if (hora.length === 3) {
        const h = hora.slice(0, 1);
        const m = hora.slice(1, 3);
        return `${h.padStart(2, '0')}:${m}`;
    } else if (hora.length === 4) {
        const h = hora.slice(0, 2);
        const m = hora.slice(2, 4);
        return `${h.padStart(2, '0')}:${m}`;
    }

    return hora;
}

function salvarObservacao(dia) {
    const input = document.getElementById(`observacao-${dia}`);
    const observacao = input.value;
}

function atualizarCampos() {
    document.getElementById('nome-display').innerText = document.getElementById('nome').value;
    document.getElementById('cpf-display').innerText = document.getElementById('cpf').value;
    document.getElementById('funcao-display').innerText = document.getElementById('funcao').value;
    document.getElementById('matricula-display').innerText = document.getElementById('matricula').value;
    document.getElementById('pis-display').innerText = document.getElementById('pis').value;
}

function formatarCPF(cpf) {
    cpf = cpf.replace(/\s+/g, ""); 
    cpf = cpf.replace(/\D/g, "");
    cpf = cpf.replace(/(\d{3})(\d)/, "$1.$2"); 
    cpf = cpf.replace(/(\d{3})(\d)/, "$1.$2"); 
    cpf = cpf.replace(/(\d{3})(\d{1,2})$/, "$1-$2"); 
    return cpf;
}

document.getElementById('cpf').addEventListener('input', function (e) {
    e.target.value = formatarCPF(e.target.value);
    atualizarCampos();
});

document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.container, .header, .footer').forEach(element => {
        element.classList.add('fade-in');
    });

    atualizarDias();

    document.getElementById('export-pdf-btn').addEventListener('click', () => {
        if (validarFormulario()) {
            exportarParaPDF();
        }
    });

    document.getElementById('inicio-ferias').addEventListener('change', atualizarFerias);
    document.getElementById('fim-ferias').addEventListener('change', atualizarFerias);
});

// ================================
// Funções de Cálculo
// ================================
function calcularHorasTrabalhadas() {
    const linhas = document.querySelectorAll('#tabela-dias tr');
    linhas.forEach((linha) => {
        const entrada = linha.querySelector('.entrada input')?.value;
        const inicioIntervalo = linha.querySelector('.inicio-intervalo input')?.value;
        const fimIntervalo = linha.querySelector('.fim-intervalo input')?.value;
        const saida = linha.querySelector('.saida input')?.value;
        const cargaHoraria = linha.querySelector('.carga-horária .resultado-carga');

        const regexHora = /^([0-1][0-9]|2[0-3]):([0-5][0-9])$/;

        if (regexHora.test(entrada) && regexHora.test(inicioIntervalo) && regexHora.test(fimIntervalo) && regexHora.test(saida)) {
            const [hEntrada, mEntrada] = entrada.split(':').map(Number);
            const [hInicioIntervalo, mInicioIntervalo] = inicioIntervalo.split(':').map(Number);
            const [hFimIntervalo, mFimIntervalo] = fimIntervalo.split(':').map(Number);
            const [hSaida, mSaida] = saida.split(':').map(Number);

            const minutosManha = (hInicioIntervalo * 60 + mInicioIntervalo) - (hEntrada * 60 + mEntrada);
            const minutosTarde = (hSaida * 60 + mSaida) - (hFimIntervalo * 60 + mFimIntervalo);
            const totalMinutos = minutosManha + minutosTarde;

            const horas = Math.floor(totalMinutos / 60);
            const minutos = totalMinutos % 60;

            cargaHoraria.textContent = `${horas}h ${minutos}m`;
        } else {
            cargaHoraria.textContent = '-';
        }
    });
}

// ================================
// Funções para salvar e calcular total de horas
// ================================
function salvarDados() {
    mostrarNotificacao("Salvando os dados...", 'info');

    const linhas = document.querySelectorAll('#tabela-dias tr');
    const dias = [];

    linhas.forEach((linha, index) => {
        const dia = index + 1;
        const entrada = linha.querySelector('.entrada input')?.value || '';
        const inicioIntervalo = linha.querySelector('.inicio-intervalo input')?.value || '';
        const fimIntervalo = linha.querySelector('.fim-intervalo input')?.value || '';
        const saida = linha.querySelector('.saida input')?.value || '';
        const observacao = linha.querySelector('.observacao input')?.value || '';

        dias.push({ dia, entrada, inicioIntervalo, fimIntervalo, saida, observacao });
    });

    localStorage.setItem('folhaDePonto', JSON.stringify({ dias }));

    atualizarTotalHoras();

    mostrarNotificacao("Dados salvos com sucesso!", 'sucesso');
}

function atualizarTotalHoras() {
    const linhas = document.querySelectorAll('#tabela-dias tr');
    let totalMinutos = 0;

    linhas.forEach((linha) => {
        const entrada = linha.querySelector('.entrada input')?.value;
        const inicioIntervalo = linha.querySelector('.inicio-intervalo input')?.value;
        const fimIntervalo = linha.querySelector('.fim-intervalo input')?.value;
        const saida = linha.querySelector('.saida input')?.value;

        const regexHora = /^([0-1][0-9]|2[0-3]):([0-5][0-9])$/;

        if (regexHora.test(entrada) && regexHora.test(inicioIntervalo) && regexHora.test(fimIntervalo) && regexHora.test(saida)) {
            const [hEntrada, mEntrada] = entrada.split(':').map(Number);
            const [hInicioIntervalo, mInicioIntervalo] = inicioIntervalo.split(':').map(Number);
            const [hFimIntervalo, mFimIntervalo] = fimIntervalo.split(':').map(Number);
            const [hSaida, mSaida] = saida.split(':').map(Number);

            const minutosManha = (hInicioIntervalo * 60 + mInicioIntervalo) - (hEntrada * 60 + mEntrada);
            const minutosTarde = (hSaida * 60 + mSaida) - (hFimIntervalo * 60 + mFimIntervalo);
            totalMinutos += minutosManha + minutosTarde;
        }
    });

    const horas = Math.floor(totalMinutos / 60);
    const minutos = totalMinutos % 60;

    document.getElementById('total-horas').textContent = `${horas}h ${minutos}m`;
}

function mostrarNotificacao(mensagem, tipo) {
    const notificacao = document.createElement('div');
    notificacao.className = `notificacao ${tipo}`;
    notificacao.textContent = mensagem;
    document.body.appendChild(notificacao);

    setTimeout(() => {
        notificacao.remove();
    }, 3000);
}
