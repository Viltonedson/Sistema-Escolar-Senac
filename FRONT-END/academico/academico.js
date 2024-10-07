document.addEventListener('DOMContentLoaded', () => {
    const turmaModal = document.getElementById('turmaModal');
    const turmaButton = document.getElementById('criarTurmaButton');
    const closeTurmaModal = document.getElementById('closeTurmaModal');

    const disciplinaModal = document.getElementById('disciplinaModal');
    const disciplinaButton = document.getElementById('criarDisciplinaButton');
    const closeDisciplinaModal = document.getElementById('closeDisciplinaModal');

    // Abrir modal de criação de turma
    turmaButton.onclick = function() {
        turmaModal.style.display = 'block';
    };

    // Fechar modal de turma
    closeTurmaModal.onclick = function() {
        turmaModal.style.display = 'none';
    };

    // Selecionando o formulário correto de turma
    const criarTurmaForm = document.getElementById('criarTurmaForm');

    // Enviar dados para criar turma
    criarTurmaForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const nome = document.getElementById('nomeTurma').value;
        const ano = document.getElementById('anoTurma').value;
        const semestres = document.getElementById('semestresTurma').value;
        const turno = document.getElementById('turnoTurma').value;

        const turmaData = { nome, ano, semestres, turno };

        try {
            const response = await fetch('http://localhost:3000/turmas', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(turmaData)
            });

            if (response.ok) {
                alert('Turma criada com sucesso!');
                turmaModal.style.display = 'none';
                fetchTurmas();
            } else {
                alert('Erro ao criar turma');
            }
        } catch (error) {
            console.error('Erro ao criar turma:', error);
        }
    });

    // Abrir modal de criação de disciplina
    disciplinaButton.onclick = function() {
        disciplinaModal.style.display = 'block';
    };

    // Fechar modal de disciplina
    closeDisciplinaModal.onclick = function() {
        disciplinaModal.style.display = 'none';
    };

    // Selecionando o formulário correto de disciplina
    const criarDisciplinaForm = document.getElementById('criarDisciplinaForm');

    // Enviar dados para criar disciplina
    criarDisciplinaForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const nome = document.getElementById('nomeDisciplina').value;
        const descricao = document.getElementById('descricaoDisciplina').value;

        const disciplinaData = { nome, descricao };

        try {
            const response = await fetch('http://localhost:3000/disciplinas', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(disciplinaData)
            });

            if (response.ok) {
                alert('Disciplina criada com sucesso!');
                disciplinaModal.style.display = 'none';
                fetchDisciplinas();
            } else {
                alert('Erro ao criar disciplina');
            }
        } catch (error) {
            console.error('Erro ao criar disciplina:', error);
        }
    });

    // Funções para buscar e popular turmas e disciplinas
    async function fetchTurmas() {
        const response = await fetch('http://localhost:3000/turmas');
        const turmas = await response.json();
        const turmaList = document.getElementById('turma-list');
        turmaList.innerHTML = ''; // Limpar a lista antes de popular

        turmas.forEach(turma => {
            const li = document.createElement('li');
            li.textContent = `${turma.nome} - ${turma.ano} - ${turma.semestres} semestres - Turno: ${turma.turno}`;
            turmaList.appendChild(li);
        });
    }

    async function fetchDisciplinas() {
        const response = await fetch('http://localhost:3000/disciplinas');
        const disciplinas = await response.json();
        const disciplinaList = document.getElementById('disciplina-list');
        disciplinaList.innerHTML = ''; // Limpar a lista antes de popular

        disciplinas.forEach(disciplina => {
            const li = document.createElement('li');
            li.textContent = `${disciplina.nome} - ${disciplina.descricao}`;
            disciplinaList.appendChild(li);
        });
    }

    // Chamar as funções para carregar turmas e disciplinas ao carregar a página
    document.getElementById('visualizarTurmasButton').addEventListener('click', fetchTurmas);
    document.getElementById('visualizarDisciplinasButton').addEventListener('click', fetchDisciplinas);
});

// Fechar os modais quando o usuário clicar fora deles
window.onclick = function(event) {
    const turmaModal = document.getElementById('turmaModal');
    const disciplinaModal = document.getElementById('disciplinaModal');

    if (event.target == turmaModal) {
        turmaModal.style.display = 'none';
    }
    if (event.target == disciplinaModal) {
        disciplinaModal.style.display = 'none';
    }
};
