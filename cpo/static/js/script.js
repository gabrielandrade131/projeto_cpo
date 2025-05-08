const meses = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];

function atualizarDias() {
    const mesIndex = document.getElementById('competencia').value - 1;
    const diasNoMes = new Date(2025, mesIndex + 1, 0).getDate();
    const tbody = document.getElementById('tabela-dias');
    tbody.innerHTML = '';

    document.getElementById('competencia-display').innerText = meses[mesIndex];

    // Recupera os dados salvos anteriormente no localStorage
    const dadosSalvos = JSON.parse(localStorage.getItem('folhaDePonto')) || { dias: [] };

    const diasSemana = ["Domingo", "Segunda-feira", "Terça-feira", "Quarta-feira", "Quinta-feira", "Sexta-feira", "Sábado"];

    for (let dia = 16; dia <= diasNoMes; dia++) {
        const data = new Date(2025, mesIndex, dia);
        const diaSemana = diasSemana[data.getDay()];
        const observacao = dadosSalvos.dias.find(d => d.dia == dia)?.observacoes || '';

        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${dia} - ${diaSemana}</td>
            <td class="entrada"><input type="text" class="hora-input" placeholder="00:00"></td>
            <td class="inicio-intervalo"><input type="text" class="hora-input" placeholder="00:00"></td>
            <td class="fim-intervalo"><input type="text" class="hora-input" placeholder="00:00"></td>
            <td class="saida"><input type="text" class="hora-input" placeholder="00:00"></td>
            <td class="carga-horária"><span id="carga-horaria-${dia}" class="resultado-carga">-</span></td>
            <td class="observacao"><input type="text" id="observacao-${dia}" value="${observacao}" onblur="salvarObservacao(${dia})"></td>
        `;
        tbody.appendChild(tr);
    }

    for (let dia = 1; dia <= 15; dia++) {
        const data = new Date(2025, mesIndex + 1, dia);
        const diaSemana = diasSemana[data.getDay()];
        const observacao = dadosSalvos.dias.find(d => d.dia == dia)?.observacoes || '';

        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${dia} - ${diaSemana}</td>
            <td class="entrada"><input type="text" class="hora-input" placeholder="00:00"></td>
            <td class="inicio-intervalo"><input type="text" class="hora-input" placeholder="00:00"></td>
            <td class="fim-intervalo"><input type="text" class="hora-input" placeholder="00:00"></td>
            <td class="saida"><input type="text" class="hora-input" placeholder="00:00"></td>
            <td class="carga-horária"><span id="carga-horaria-${dia}" class="resultado-carga">-</span></td>
            <td class="observacao"><input type="text" id="observacao-${dia}" value="${observacao}" onblur="salvarObservacao(${dia})"></td>
        `;
        tbody.appendChild(tr);
    }

    // Adiciona eventos para cálculo da carga horária
    adicionarEventosCalculoCargaHoraria();
}

function adicionarEventosCalculoCargaHoraria() {
    // Seleciona todos os inputs de horário na tabela
    const inputs = document.querySelectorAll('#tabela-dias input.hora-input');

    // Adiciona o evento 'input' para validar e recalcular as horas
    inputs.forEach((input) => {
        input.addEventListener('input', () => {
            // Remove caracteres não numéricos, exceto o caractere ':'
            input.value = input.value.replace(/[^0-9:]/g, '');

            // Valida o formato de hora (H:mm ou HH:mm)
            const regexHora = /^([0-9]|[0-1][0-9]|2[0-3]):([0-5][0-9])$/;
            if (!regexHora.test(input.value) && input.value !== '') {
                input.classList.add('invalid');
            } else {
                input.classList.remove('invalid');
                // Normaliza o valor para o formato HH:mm
                input.value = normalizarHora(input.value);
                calcularHorasTrabalhadas();
            }
        });
    });
}

// Função para normalizar o horário para o formato HH:mm
function normalizarHora(hora) {
    // Remove caracteres não numéricos
    hora = hora.replace(/\D/g, '');

    // Se o horário tiver 3 ou 4 dígitos, converte para o formato HH:mm
    if (hora.length === 3) {
        const h = hora.slice(0, 1);
        const m = hora.slice(1, 3);
        return `${h.padStart(2, '0')}:${m}`;
    } else if (hora.length === 4) {
        const h = hora.slice(0, 2);
        const m = hora.slice(2, 4);
        return `${h.padStart(2, '0')}:${m}`;
    }

    // Retorna o horário original se não for possível normalizar
    return hora;
}

function salvarObservacao(dia) {
    const input = document.getElementById(`observacao-${dia}`);
    const observacao = input.value;
    // Aqui você pode adicionar qualquer lógica adicional para salvar a observação
}

function atualizarCampos() {
    document.getElementById('nome-display').innerText = document.getElementById('nome').value;
    document.getElementById('cpf-display').innerText = document.getElementById('cpf').value;
    document.getElementById('funcao-display').innerText = document.getElementById('funcao').value;
    document.getElementById('matricula-display').innerText = document.getElementById('matricula').value;
}

function formatarCPF(cpf) {
    cpf = cpf.replace(/\s+/g, ""); // Remove todos os espaços
    cpf = cpf.replace(/\D/g, ""); // Remove caracteres não numéricos
    cpf = cpf.replace(/(\d{3})(\d)/, "$1.$2"); // Adiciona o primeiro ponto
    cpf = cpf.replace(/(\d{3})(\d)/, "$1.$2"); // Adiciona o segundo ponto
    cpf = cpf.replace(/(\d{3})(\d{1,2})$/, "$1-$2"); // Adiciona o traço
    return cpf;
}

document.getElementById('cpf').addEventListener('input', function (e) {
    e.target.value = formatarCPF(e.target.value);
    atualizarCampos();
});

document.addEventListener('DOMContentLoaded', () => {
    // Adiciona a classe de animação aos elementos desejados
    document.querySelectorAll('.container, .header, .footer').forEach(element => {
        element.classList.add('fade-in');
    });

    atualizarDias(); // Inicializa a tabela com o mês atual

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

// Função para salvar os dados e calcular o total de horas
function salvarDados() {
    // Exibe uma mensagem de carregamento
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

    // Salva os dados no localStorage
    localStorage.setItem('folhaDePonto', JSON.stringify({ dias }));

    // Atualiza o total de horas
    atualizarTotalHoras();

    // Exibe uma mensagem de sucesso após salvar
    mostrarNotificacao("Dados salvos com sucesso!", 'sucesso');
}

// Função para calcular e atualizar o total de horas
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

    const totalHorasDisplay = document.getElementById('TotalHoras-display');
    totalHorasDisplay.innerText = `${horas}h ${minutos}m`;

    // Adiciona a classe de animação
    totalHorasDisplay.classList.add('highlight');

    // Remove a classe após a animação
    setTimeout(() => {
        totalHorasDisplay.classList.remove('highlight');
    }, 1000); // Tempo da animação (1s)
}

// Adiciona o evento de clique ao botão "Salvar"
document.getElementById('salvar-btn').addEventListener('click', salvarDados);

// ================================
// Inicialização e Eventos
// ================================
document.addEventListener('DOMContentLoaded', () => {
    // Adiciona eventos para recalcular as horas sempre que um campo for alterado
    document.querySelectorAll('#tabela-dias input').forEach((input) => {
        input.addEventListener('input', calcularHorasTrabalhadas);
    });

    // Inicializa a tabela com os dias do mês atual
    atualizarDias();
});

function mostrarCamposFerias() {
    const feriasCheckbox = document.getElementById('ferias');
    const campoInicioFerias = document.getElementById('campo-inicio-ferias');
    const campoFimFerias = document.getElementById('campo-fim-ferias');

    if (feriasCheckbox.checked) {
        campoInicioFerias.style.display = 'block';
        campoFimFerias.style.display = 'block';
        campoInicioFerias.classList.remove('fade-out');
        campoFimFerias.classList.remove('fade-out');
        campoInicioFerias.classList.add('fade-in');
        campoFimFerias.classList.add('fade-in');
    } else {
        campoInicioFerias.classList.remove('fade-in');
        campoFimFerias.classList.remove('fade-in');
        campoInicioFerias.classList.add('fade-out');
        campoFimFerias.classList.add('fade-out');
        setTimeout(() => {
            campoInicioFerias.style.display = 'none';
            campoFimFerias.style.display = 'none';
            document.getElementById('inicio-ferias').value = '';
            document.getElementById('fim-ferias').value = '';
            atualizarDias(); // Recarrega os dias para remover as férias
        }, 500); // Tempo da animação
    }
}

function atualizarFerias() {
    console.log("Função atualizarFerias chamada");
    const inicioFerias = new Date(document.getElementById('inicio-ferias').value + 'T00:00:00');
    const fimFerias = new Date(document.getElementById('fim-ferias').value + 'T00:00:00');
    const mesIndex = document.getElementById('competencia').value - 1;

    if (isNaN(inicioFerias) || isNaN(fimFerias)) {
        return;
    }

    for (let data = new Date(inicioFerias); data <= fimFerias; data.setDate(data.getDate() + 1)) {
        const dia = data.getDate();
        const mes = data.getMonth();
        if (mes === mesIndex || (mes === mesIndex + 1 && dia <= 15)) {
            const observacaoInput = document.getElementById(`observacao-${dia}`);
            if (observacaoInput) {
                observacaoInput.value = 'Férias';
            }
        }
    }
}

function mostrarCarregamento() {
    document.getElementById('loading').style.display = 'flex';
}

function esconderCarregamento() {
    setTimeout(() => {
        document.getElementById('loading').style.display = 'none';
    }, 2000); // Mantém a tela de carregamento visível por 2 segundos
}

function mostrarMensagemSucesso() {
    const mensagemSucesso = document.getElementById('success-message');
    mensagemSucesso.style.display = 'block';
    setTimeout(() => {
        mensagemSucesso.style.display = 'none';
    }, 3000); // Exibe a mensagem de sucesso por 3 segundos
}

function exportarParaPDF() {
    const { jsPDF } = window.jspdf;
    if (!jsPDF) {
        mostrarNotificacao("Erro: jsPDF não foi carregado corretamente!", 'erro');
        return;
    }

    // Remove os placeholders antes de gerar o PDF
    const inputs = document.querySelectorAll('input.hora-input');
    inputs.forEach(input => {
        input.setAttribute('data-placeholder', input.getAttribute('placeholder')); // Salva o placeholder
        input.removeAttribute('placeholder'); // Remove o placeholder
    });

    mostrarCarregamento();

    html2canvas(document.querySelector(".folha-de-ponto"), {
        scale: 2,
        useCORS: true,
        allowTaint: false
    }).then(canvas => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        const imgProps = pdf.getImageProperties(imgData);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

        pdf.addImage(imgData, 'PNG', 10, 10, pdfWidth - 20, pdfHeight - 20);
        pdf.save("folha_de_ponto.pdf");

        // Restaura os placeholders após a geração do PDF
        inputs.forEach(input => {
            input.setAttribute('placeholder', input.getAttribute('data-placeholder')); // Restaura o placeholder
            input.removeAttribute('data-placeholder'); // Remove o atributo temporário
        });

        esconderCarregamento();
        mostrarNotificacao("PDF gerado com sucesso!", 'sucesso');
    }).catch(err => {
        console.error("Erro ao gerar PDF:", err);

        // Restaura os placeholders em caso de erro
        inputs.forEach(input => {
            input.setAttribute('placeholder', input.getAttribute('data-placeholder')); // Restaura o placeholder
            input.removeAttribute('data-placeholder'); // Remove o atributo temporário
        });

        esconderCarregamento();
        mostrarNotificacao("Erro ao gerar PDF.", 'erro');
    });
}

function atualizarFolga() {
    const folgaCheckbox = document.getElementById('folga');
    const diasFolgaInput = document.getElementById('dias-folga');
    const aplicarFolgaBtn = document.getElementById('aplicar-folga-btn');
    diasFolgaInput.disabled = !folgaCheckbox.checked;
    aplicarFolgaBtn.disabled = !folgaCheckbox.checked;
    if (!folgaCheckbox.checked) {
        diasFolgaInput.value = '';
        atualizarDias(); // Recarrega os dias para remover as folgas
    }
}

function aplicarFolga() {
    const diasFolgaInput = document.getElementById('dias-folga');
    const diasFolga = diasFolgaInput.value.split(',').map(dia => dia.trim());
    diasFolga.forEach(dia => {
        const diaInt = parseInt(dia, 10); // Converte o dia para inteiro
        if (!isNaN(diaInt)) {
            const observacaoInput = document.getElementById(`observacao-${diaInt}`);
            if (observacaoInput) {
                observacaoInput.value = 'FOLGA'; // Força o texto para maiúsculas
            }
        }
    });
}

function abrirModal(id) {
    const modal = document.getElementById(id);
    modal.style.display = 'block';
}

function fecharModal(id) {
    const modal = document.getElementById(id);
    modal.style.display = 'none';
}

function aplicarFerias() {
    const inicioFerias = new Date(document.getElementById('inicio-ferias').value + 'T00:00:00');
    const fimFerias = new Date(document.getElementById('fim-ferias').value + 'T00:00:00');
    const mesIndex = document.getElementById('competencia').value - 1;

    if (isNaN(inicioFerias) || isNaN(fimFerias)) {
        mostrarNotificacao("Por favor, insira datas válidas para o início e fim das férias.", 'erro');
        return;
    }

    for (let data = new Date(inicioFerias); data <= fimFerias; data.setDate(data.getDate() + 1)) {
        const dia = data.getDate();
        const mes = data.getMonth();
        if (mes === mesIndex || (mes === mesIndex + 1 && dia <= 15)) {
            const observacaoInput = document.getElementById(`observacao-${dia}`);
            if (observacaoInput) {
                observacaoInput.value = 'FÉRIAS'; // Força o texto para maiúsculas
            }
        }
    }

    fecharModal('ferias-modal');
    mostrarNotificacao("Período de férias aplicado com sucesso!", 'sucesso');
}

function validarFormulario() {
    const nome = document.getElementById('nome');
    const cpf = document.getElementById('cpf');
    const competencia = document.getElementById('competencia');
    let valido = true;

    if (!nome.value) {
        nome.classList.add('invalid');
        valido = false;
    } else {
        nome.classList.remove('invalid');
    }

    if (!cpf.value) {
        cpf.classList.add('invalid');
        valido = false;
    } else {
        cpf.classList.remove('invalid');
    }

    if (!competencia.value) {
        competencia.classList.add('invalid');
        valido = false;
    } else {
        competencia.classList.remove('invalid');
    }

    if (!valido) {
        mostrarNotificacao("Por favor, preencha todos os campos obrigatórios.", 'erro');
    }

    return valido;
}

function confirmarAcao(mensagem, acao) {
    if (confirm(mensagem)) {
        acao();
    }
}

function mostrarNotificacao(mensagem, tipo = 'sucesso') {
    const notificacao = document.createElement('div');
    notificacao.className = `notificacao ${tipo}`;
    notificacao.innerText = mensagem;
    document.body.appendChild(notificacao);
    notificacao.style.display = 'block';
    setTimeout(() => {
        notificacao.style.display = 'none';
        notificacao.remove();
    }, 3000); // Exibe a notificação por 3 segundos
}
