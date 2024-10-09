const comunicacaoForm = document.getElementById('comunicacao-form');
const comunicacaoList = document.getElementById('comunicacao-list');
let comunicacoes = [];

function renderizarComunicacoes() {
    comunicacaoList.innerHTML = '';

    comunicacoes.forEach((comunicacao, index) => {
        const li = document.createElement('li');
        li.innerHTML = `
            <strong>Título:</strong> ${comunicacao.titulo} <br>
            <strong>Descrição:</strong> ${comunicacao.descricao} <br>
            <strong>Data:</strong> ${comunicacao.data} <br>
            <strong>Destinatário:</strong> ${comunicacao.destinatario} <br>
            <button onclick="excluirComunicacao(${index})">Excluir</button>
        `;
        comunicacaoList.appendChild(li);
    });
}

function excluirComunicacao(index) {
    comunicacoes.splice(index, 1);
    renderizarComunicacoes();
}

comunicacaoForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const titulo = document.getElementById('titulo').value;
    const descricao = document.getElementById('descricao').value;
    const data = document.getElementById('data').value;
    const destinatario = document.getElementById('destinatario').value;

    comunicacoes.push({ titulo, descricao, data, destinatario });

    document.getElementById('titulo').value = '';
    document.getElementById('descricao').value = '';
    document.getElementById('data').value = '';
    document.getElementById('destinatario').value = '';

    renderizarComunicacoes();
});


renderizarComunicacoes();

async function buscarComunicados() {
    try {
        const response = await fetch('http://localhost:3000/comunicados')
        if (!response.ok) {
            throw new Error('Erro ao buscar comunicados');
        }
        comunicacoes = await response.json();
        renderizarComunicacoes();
    } catch (error) {
        console.error(error);
    }
}

