// Extrair turmaId da URL
const urlParams = new URLSearchParams(window.location.search);
const turmaId = urlParams.get('turmaId');

// Verificar se temos um turmaId válido
if (!turmaId) {
    alert('ID da turma não fornecido');
    // Redirecionar para a página anterior ou mostrar mensagem de erro
    window.location.href = 'academico.html';
}

const disciplinasList = document.getElementById('disciplinas-list');
const disciplinasSelect = document.getElementById('disciplinasSelect');
const turmaNome = document.getElementById('nomeTurma');
const listaAlunos = document.getElementById('listaAlunos');
const adicionarAlunoButton = document.getElementById('adicionarAlunoButton');
const alunoModal = document.getElementById('alunoModal');
const closeAlunoModal = document.getElementById('closeAlunoModal');
const alunosSelect = document.getElementById('alunosSelect');

// Abrir modal para adicionar aluno
adicionarAlunoButton.addEventListener('click', () => {
    alunoModal.style.display = 'block';
});

// Fechar modal
closeAlunoModal.addEventListener('click', () => {
    alunoModal.style.display = 'none';
});

// Buscar detalhes da turma e disciplinas
async function fetchTurmaDetails() {
    try {
        const response = await fetch(`http://localhost:3000/turmas/${turmaId}`);
        const turma = await response.json();
        
        if (turma && turma.nome) {
            turmaNome.textContent = turma.nome;
        } else {
            turmaNome.textContent = 'Nome não encontrado';
        }
        // Buscar as disciplinas da turma
        fetchDisciplinasDaTurma();
        // Buscar alunos da turma
        fetchAlunosDaTurma();
    } catch (error) {
        console.error('Erro ao buscar detalhes da turma:', error);
    }
}

// Buscar disciplinas disponíveis para adicionar
async function fetchDisciplinas() {
    try {
        const response = await fetch('http://localhost:3000/disciplinas');
        const disciplinas = await response.json();

        disciplinas.forEach(disciplina => {
            const option = document.createElement('option');
            option.value = disciplina._id;
            option.textContent = disciplina.nome;
            disciplinasSelect.appendChild(option);
        });
    } catch (error) {
        console.error('Erro ao buscar disciplinas:', error);
    }
}

// Buscar disciplinas vinculadas à turma e os professores responsáveis
async function fetchDisciplinasDaTurma() {
    try {
        const response = await fetch(`http://localhost:3000/turmas/${turmaId}/disciplinas`);
        const disciplinas = await response.json();

        disciplinasList.innerHTML = ''; // Limpar a tabela

        disciplinas.forEach(disciplina => {
            const tr = document.createElement('tr');
            const disciplinaTd = document.createElement('td');
            const professorTd = document.createElement('td');

            disciplinaTd.textContent = disciplina.nome;
            professorTd.textContent = disciplina.professor ? disciplina.professor.name : 'Nenhum professor vinculado';

            tr.appendChild(disciplinaTd);
            tr.appendChild(professorTd);

            disciplinasList.appendChild(tr);
        });
    } catch (error) {
        console.error('Erro ao buscar disciplinas da turma:', error);
    }
}

// Adicionar disciplina à turma
document.getElementById('addDisciplinaForm').addEventListener('submit', async (event) => {
    event.preventDefault();

    const disciplinaId = disciplinasSelect.value;

    try {
        const response = await fetch(`http://localhost:3000/TurmasDisciplinas/${turmaId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ disciplinaId })
        });

        if (response.ok) {
            alert('Disciplina adicionada com sucesso!');
            fetchDisciplinasDaTurma()
        } else {
            alert('Erro ao adicionar disciplina.');
        }
    } catch (error) {
        console.error('Erro ao adicionar disciplina:', error);
    }
});

// Buscar alunos vinculados à turma
async function fetchAlunosDaTurma() {
    try {
        const response = await fetch(`http://localhost:3000/turmas/${turmaId}/alunos`);
        const alunos = await response.json();

        listaAlunos.innerHTML = ''; // Limpar a lista de alunos

        alunos.forEach(aluno => {
            const li = document.createElement('li');
            li.textContent = aluno.name;
            listaAlunos.appendChild(li);
        });
    } catch (error) {
        console.error('Erro ao buscar alunos da turma:', error);
    }
}

// Buscar alunos disponíveis para adicionar
async function fetchAlunos() {
    try {
        const response = await fetch('http://localhost:3000/users?tipodeUsuario=Aluno');
        const alunos = await response.json();

        alunos.forEach(aluno => {
            const option = document.createElement('option');
            option.value = aluno._id;
            option.textContent = aluno.name;
            alunosSelect.appendChild(option);
        });
    } catch (error) {
        console.error('Erro ao buscar alunos:', error);
    }
}

// Adicionar aluno à turma
document.getElementById('adicionarAlunoForm').addEventListener('submit', async (event) => {
    event.preventDefault();

    const alunoId = alunosSelect.value;

    try {
        const response = await fetch(`http://localhost:3000/turmas/${turmaId}/alunos`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ alunoId })
        });

        if (response.ok) {
            alert('Aluno adicionado com sucesso!');
            fetchAlunosDaTurma(); // Atualizar a lista de alunos
            alunoModal.style.display = 'none'; // Fechar o modal
        } else {
            alert('Erro ao adicionar aluno.');
        }
    } catch (error) {
        console.error('Erro ao adicionar aluno:', error);
    }
});

// Carregar os dados quando a página carregar
document.addEventListener('DOMContentLoaded', () => {
    fetchTurmaDetails();
    fetchDisciplinas();
    fetchAlunos();
});
