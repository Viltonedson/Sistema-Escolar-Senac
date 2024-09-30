const taxaForm = document.getElementById('taxa-form');
const descricaoTaxInput = document.getElementById('descricao-tax');
const valorTaxInput = document.getElementById('valor-tax');
const alunoIdInput = document.getElementById('aluno-id');
const erroTaxa = document.getElementById('erro-taxa');
const taxaList = document.getElementById('taxa-list');
const boletoAlunoIdInput = document.getElementById('boleto-aluno-id');
const gerarBoletoBtn = document.getElementById('gerar-boleto');
const mensagemBoleto = document.getElementById('mensagem-boleto');

let taxas = [];

// Função para renderizar a lista de taxas a pagar
function renderizarTaxas() {
    taxaList.innerHTML = '';
    taxas.forEach(taxa => {
        const li = document.createElement('li');
        li.textContent = `Aluno ID: ${taxa.alunoId} - ${taxa.descricao}: R$ ${taxa.valor.toFixed(2)}`;
        taxaList.appendChild(li);
    });
}

// Evento para adicionar uma nova taxa
taxaForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const descricao = descricaoTaxInput.value.trim();
    const valor = parseFloat(valorTaxInput.value);
    const alunoId = alunoIdInput.value.trim();

    if (descricao === '' || isNaN(valor) || valor <= 0 || alunoId === '') {
        erroTaxa.textContent = 'Preencha todos os campos corretamente!';
    } else {
        erroTaxa.textContent = '';

        // Adiciona a taxa
        taxas.push({ descricao, valor, alunoId });

        renderizarTaxas();
        descricaoTaxInput.value = '';
        valorTaxInput.value = '';
        alunoIdInput.value = '';
    }
});

// Evento para gerar boleto
gerarBoletoBtn.addEventListener('click', () => {
    const alunoId = boletoAlunoIdInput.value.trim();
    const taxaParaGerarBoleto = taxas.filter(taxa => taxa.alunoId === alunoId);

    if (taxaParaGerarBoleto.length > 0) {
        const totalBoleto = taxaParaGerarBoleto.reduce((total, taxa) => total + taxa.valor, 0);
        mensagemBoleto.textContent = `Boleto gerado para o Aluno ID: ${alunoId}. Total: R$ ${totalBoleto.toFixed(2)}`;
    } else {
        mensagemBoleto.textContent = 'Nenhuma taxa encontrada para esse Aluno ID.';
    }
});

// Inicializar a página
renderizarTaxas();
