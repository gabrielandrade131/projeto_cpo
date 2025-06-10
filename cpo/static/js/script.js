const meses = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];

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
    const competenciaSelect = document.getElementById('competencia');
    document.getElementById('competencia-display').innerText = competenciaSelect.options[competenciaSelect.selectedIndex].text;
}

document.getElementById('competencia').addEventListener('change', atualizarCampos);

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

document.getElementById('export-pdf-btn').addEventListener('click', exportarParaPDF);

// ================================
// Inicialização e Eventos
// ================================
document.addEventListener('DOMContentLoaded', () => {
    gerarTabelaDias();
    adicionarEventosCalculoCargaHoraria();
    atualizarCampos();

    // Atualiza a tabela ao trocar a competência
    document.getElementById('competencia').addEventListener('change', () => {
        gerarTabelaDias();
        adicionarEventosCalculoCargaHoraria();
        atualizarCampos();
    });
    document.getElementById('ano-competencia').addEventListener('change', () => {
        gerarTabelaDias();
        adicionarEventosCalculoCargaHoraria();
        atualizarCampos();
    });
});

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
    const jsPDF = window.jspdf && window.jspdf.jsPDF;
    if (!jsPDF) {
        mostrarNotificacao("Erro: jsPDF não foi carregado corretamente!", 'erro');
        return;
    }

    // Remove os placeholders antes de gerar o PDF
    const inputs = document.querySelectorAll('input.hora-input');
    inputs.forEach(input => {
        input.setAttribute('data-placeholder', input.getAttribute('placeholder'));
        input.removeAttribute('placeholder');
    });

    mostrarCarregamento();

    html2canvas(document.querySelector('.folha-de-ponto'), {
        scale: 2,
        useCORS: true,
        scrollY: -window.scrollY
    }).then(function(canvas) {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new window.jspdf.jsPDF({
            orientation: 'portrait',
            unit: 'cm',
            format: 'a4'
        });

        const pageWidth = 21;
        const pageHeight = 29.7;

        // Calcula a altura proporcional para caber na página
        let imgWidth = pageWidth;
        let imgHeight = canvas.height * imgWidth / canvas.width;

        // Se a imagem for mais alta que a página, reduz a altura para caber
        if (imgHeight > pageHeight) {
            imgHeight = pageHeight;
            imgWidth = canvas.width * imgHeight / canvas.height;
        }

        // Centraliza na página se sobrar espaço
        const x = (pageWidth - imgWidth) / 2;
        const y = (pageHeight - imgHeight) / 2;

        pdf.addImage(imgData, 'PNG', x, y, imgWidth, imgHeight);
        pdf.save('folha_de_ponto.pdf');

        // Restaura os placeholders após a geração do PDF
        inputs.forEach(input => {
            input.setAttribute('placeholder', input.getAttribute('data-placeholder'));
            input.removeAttribute('data-placeholder');
        });

        esconderCarregamento();
        mostrarNotificacao("PDF gerado com sucesso!", 'sucesso');
    }).catch(err => {
        console.error("Erro ao gerar PDF:", err);
        inputs.forEach(input => {
            input.setAttribute('placeholder', input.getAttribute('data-placeholder'));
            input.removeAttribute('data-placeholder');
        });
        esconderCarregamento();
        mostrarNotificacao("Erro ao gerar PDF.", 'erro');
    });
}

function validarFormulario() {
    const competencia = document.getElementById('competencia');
    let valido = true;

    if (!competencia.value) {
        competencia.classList.add('invalid');
        valido = false;
    } else {
        competencia.classList.remove('invalid');
    }

    if (!valido) {
        mostrarNotificacao("Por favor, selecione a competência.", 'erro');
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
document.addEventListener('DOMContentLoaded', function() {
        function getCompetenciaKey() {
            const competencia = document.getElementById('competencia').value;
            return competencia ? `folha_ponto_${competencia}` : null;
        }

        function salvarTabelaLocal() {
            const key = getCompetenciaKey();
            if (!key) return;
            const linhas = [];
            document.querySelectorAll('#tabela-dias tr').forEach(tr => {
                const cells = Array.from(tr.querySelectorAll('input')).map(input => input.value);
                linhas.push(cells);
            });
            localStorage.setItem(key, JSON.stringify(linhas));
        }

        function carregarTabelaLocal() {
            const key = getCompetenciaKey();
            if (!key) return;
            const dados = localStorage.getItem(key);
            if (!dados) {
                // Limpa a tabela se não houver dados
                document.querySelectorAll('#tabela-dias tr').forEach(tr => {
                    tr.querySelectorAll('input').forEach(input => input.value = '');
                });
                return;
            }
            const linhas = JSON.parse(dados);
            document.querySelectorAll('#tabela-dias tr').forEach((tr, i) => {
                const inputs = tr.querySelectorAll('input');
                if (linhas[i]) {
                    linhas[i].forEach((valor, j) => {
                        if (inputs[j]) inputs[j].value = valor;
                    });
                }
            });
        }

        // Salva sempre que algum campo da tabela muda
        document.querySelectorAll('#tabela-dias input').forEach(input => {
            input.addEventListener('input', salvarTabelaLocal);
        });

        // Carrega ao trocar competência
        document.getElementById('competencia').addEventListener('change', function() {
            atualizarCampos();
        });

        // Carrega ao abrir a página
        carregarTabelaLocal();
    });

document.getElementById('data-admissao').addEventListener('input', atualizarCampos);
document.getElementById('competencia').addEventListener('change', atualizarCampos);

function gerarTabelaDias() {
    const competencia = parseInt(document.getElementById('competencia').value);
    const anoSelecionado = parseInt(document.getElementById('ano-competencia').value);
    const tabela = document.getElementById('tabela-dias');
    tabela.innerHTML = '';

    if (!competencia || !anoSelecionado) return;

    let anoCompetencia = anoSelecionado;

    // Se competência for Janeiro, mês anterior é Dezembro do ano anterior
    let mesAnterior = competencia - 2; // JS: 0=Jan, 1=Fev...
    let anoAnterior = anoCompetencia;
    if (mesAnterior < 0) {
        mesAnterior = 11;
        anoAnterior = anoCompetencia - 1;
    }

    // Dias do mês anterior (16 até o fim)
    const diasMesAnterior = new Date(anoAnterior, mesAnterior + 1, 0).getDate();
    for (let dia = 16; dia <= diasMesAnterior; dia++) {
        tabela.appendChild(criarLinhaDia(dia, mesAnterior + 1, anoAnterior));
    }

    // Dias do mês da competência (1 até 15)
    for (let dia = 1; dia <= 15; dia++) {
        tabela.appendChild(criarLinhaDia(dia, competencia, anoCompetencia));
    }
}

function criarLinhaDia(dia, mes, ano) {
    const tr = document.createElement('tr');
    tr.innerHTML = `
        <td>${dia.toString().padStart(2, '0')}</td>
        <td class="entrada"><input type="text" class="hora-input"></td>
        <td class="inicio-intervalo"><input type="text" class="hora-input"></td>
        <td class="fim-intervalo"><input type="text" class="hora-input"></td>
        <td class="saida"><input type="text" class="hora-input"></td>
        <td class="rdo"><input type="text" maxlength="20"></td>
        <td class="regime"><input type="text" maxlength="20"></td>
        <td class="hora-extra"><input type="text" maxlength="20"></td>
        <td class="observacao"><input type="text" id="observacao-${dia}-${mes}-${ano}" maxlength="20"></td>
        <td class="assinatura"><input type="text" maxlength="30"></td>
    `;
    return tr;
}

// Atualize a tabela sempre que a competência mudar
document.getElementById('competencia').addEventListener('change', () => {
    gerarTabelaDias();
    adicionarEventosCalculoCargaHoraria();
    atualizarCampos();
});
document.getElementById('ano-competencia').addEventListener('change', () => {
    gerarTabelaDias();
    adicionarEventosCalculoCargaHoraria();
    atualizarCampos();
});