const meses = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];

function gerarTabelaDias() {
    const competencia = parseInt(document.getElementById('competencia').value);
    const anoSelecionado = parseInt(document.getElementById('ano-competencia').value);
    const tabela = document.getElementById('tabela-dias');
    tabela.innerHTML = '';
    if (!competencia || !anoSelecionado) return;
    let anoCompetencia = anoSelecionado;
    let mesAnterior = competencia - 2;
    let anoAnterior = anoCompetencia;
    if (mesAnterior < 0) {
        mesAnterior = 11;
        anoAnterior = anoCompetencia - 1;
    }
    const diasMesAnterior = new Date(anoAnterior, mesAnterior + 1, 0).getDate();
    for (let dia = 16; dia <= diasMesAnterior; dia++) {
        tabela.appendChild(criarLinhaDia(dia, mesAnterior + 1, anoAnterior));
    }
    for (let dia = 1; dia <= 15; dia++) {
        tabela.appendChild(criarLinhaDia(dia, competencia, anoCompetencia));
    }
}

function criarLinhaDia(dia, mes, ano) {
    const tr = document.createElement('tr');
    tr.innerHTML = `
        <td>${dia.toString().padStart(2, '0')}</td>
        <td class="entrada"></td>
        <td class="inicio-intervalo"></td>
        <td class="fim-intervalo"></td>
        <td class="saida"></td>
        <td class="rdo"></td>
        <td class="regime"></td>
        <td class="hora-extra"></td>
        <td class="observacao" id="observacao-${dia}-${mes}-${ano}"></td>
        <td class="assinatura"></td>
    `;
    return tr;
}

function preencherTabelaComDados(dados) {
    const tabela = document.getElementById('tabela-dias');
    const linhas = tabela.querySelectorAll('tr');
    dados.forEach((dia, i) => {
        const inputs = linhas[i]?.querySelectorAll('input');
        if (inputs && dia) {
            inputs[0].value = dia.entrada || '';
            inputs[1].value = dia.inicio_intervalo || '';
            inputs[2].value = dia.fim_intervalo || '';
            inputs[3].value = dia.saida || '';
            inputs[4].value = dia.rdo || '';
            inputs[5].value = dia.regime || '';
            inputs[6].value = dia.hora_extra || '';
            inputs[7].value = dia.observacao || '';
            inputs[8].value = dia.assinatura || '';
        }
    });
}

document.addEventListener('DOMContentLoaded', function() {
    gerarTabelaDias();
    if (window.dadosDias) {
        preencherTabelaComDados(window.dadosDias);
    }
    document.getElementById('competencia').addEventListener('change', () => {
        gerarTabelaDias();
        if (window.dadosDias) {
            preencherTabelaComDados(window.dadosDias);
        }
    });
    document.getElementById('ano-competencia').addEventListener('change', () => {
        gerarTabelaDias();
        if (window.dadosDias) {
            preencherTabelaComDados(window.dadosDias);
        }
    });
});

function exportarParaPDF() {
    const jsPDF = window.jspdf && window.jspdf.jsPDF;
    if (!jsPDF) return;
    const inputs = document.querySelectorAll('input.hora-input');
    inputs.forEach(input => {
        input.setAttribute('data-placeholder', input.getAttribute('placeholder'));
        input.removeAttribute('placeholder');
    });
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
        let imgWidth = pageWidth;
        let imgHeight = canvas.height * imgWidth / canvas.width;
        if (imgHeight > pageHeight) {
            imgHeight = pageHeight;
            imgWidth = canvas.width * imgHeight / canvas.height;
        }
        const x = (pageWidth - imgWidth) / 2;
        const y = (pageHeight - imgHeight) / 2;
        pdf.addImage(imgData, 'PNG', x, y, imgWidth, imgHeight);
        pdf.save('folha_de_ponto.pdf');
        inputs.forEach(input => {
            input.setAttribute('placeholder', input.getAttribute('data-placeholder'));
            input.removeAttribute('data-placeholder');
        });
    });
}
function atualizarCampos() {
    const mes = document.getElementById("competencia").value;
    const ano = document.getElementById("ano-competencia").value;
    const mesNome = meses[mes - 1];
    if (mes && ano) {
        document.getElementById("competencia-display").innerText = mesNome;
    } else {
        document.getElementById("competencia-display").innerText = "";
    }
}
