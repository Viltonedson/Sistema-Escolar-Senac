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
                carregarDisciplinas();
            } else {
                alert('Erro ao criar disciplina');
            }
        } catch (error) {
            console.error('Erro ao criar disciplina:', error);
        }
    });

    // Função para carregar turmas no select
    async function carregarTurmas() {
        try {
            const response = await fetch('http://localhost:3000/turmas');
            const turmas = await response.json();
            const selectTurma = document.getElementById('selectTurma');
            selectTurma.innerHTML = '<option value="">Selecione uma turma</option>';
            
            turmas.forEach(turma => {
                const option = document.createElement('option');
                option.value = turma._id;
                option.textContent = turma.nome;
                selectTurma.appendChild(option);
            });
        } catch (error) {
            console.error('Erro ao carregar turmas:', error);
        }
    }

    // Função para carregar disciplinas no select
    async function carregarDisciplinas() {
        try {
            const response = await fetch('http://localhost:3000/disciplinas');
            const disciplinas = await response.json();
            const selectDisciplina = document.getElementById('selectDisciplina');
            selectDisciplina.innerHTML = '<option value="">Selecione uma disciplina</option>';
            
            disciplinas.forEach(disciplina => {
                const option = document.createElement('option');
                option.value = disciplina._id;
                option.textContent = disciplina.nome;
                selectDisciplina.appendChild(option);
            });
        } catch (error) {
            console.error('Erro ao carregar disciplinas:', error);
        }
    }

    // Carregar turmas e disciplinas quando a página carregar
    carregarTurmas();
    carregarDisciplinas();

    // Adicionar disciplina à turma
    const adicionarDisciplinaForm = document.getElementById('adicionarDisciplinaForm');
    if (adicionarDisciplinaForm) {
        adicionarDisciplinaForm.addEventListener('submit', async (event) => {
            event.preventDefault();

            const turma_id = document.getElementById('selectTurma').value;
            const disciplina_id = document.getElementById('selectDisciplina').value;

            if (!turma_id || !disciplina_id) {
                alert('Por favor, selecione uma turma e uma disciplina');
                return;
            }

            try {
                const response = await fetch('http://localhost:3000/turmas-disciplinas', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ turma_id, disciplina_id })
                });

                if (response.ok) {
                    alert('Disciplina adicionada à turma com sucesso!');
                    // Limpar os selects
                    document.getElementById('selectTurma').value = '';
                    document.getElementById('selectDisciplina').value = '';
                } else {
                    const error = await response.json();
                    alert(error.message || 'Erro ao adicionar disciplina à turma');
                }
            } catch (error) {
                console.error('Erro ao adicionar disciplina à turma:', error);
                alert('Erro ao adicionar disciplina à turma');
            }
        });
    }
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
