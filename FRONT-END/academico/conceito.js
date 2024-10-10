const Conceito = require("../../models/Conceito");

// Extrair turmaId da URL
const urlParams = new URLSearchParams(window.location.search);
const turmaId = urlParams.get('turmaId');
const disciplinasList = document.getElementById('disciplinasList');
const alunosList = document.getElementById('alunosList');

// Buscar disciplinas da turma
async function fetchDisciplinasDaTurma() {
    try {
        const response = await fetch(`http://localhost:3000/TurmasDisciplinas/${turmaId}`);
        const disciplinas = await response.json();

        disciplinasContainer.innerHTML = '';

        disciplinas.forEach(disciplina => {
            const button = document.createElement('button');
            button.textContent = disciplina.nome;
            button.classList.add('disciplina-btn');

          
            button.addEventListener('click', () => fetchAlunosConceitos(disciplina._id));

            disciplinasContainer.appendChild(button);
        });
    } catch (error) {
        console.error('Erro ao buscar disciplinas da turma:', error);
    }
}

// Buscar alunos e conceitos relacionados à disciplina
async function fetchAlunosConceitos(disciplinaId) {
    try {
        const response = await fetch(`http://localhost:3000/Conceito/${Conceito}`);
        const alunosConceitos = await response.json();

        alunosList.innerHTML = ''; 

        
        alunosConceitos.forEach(item => {
            const tr = document.createElement('tr');

            const alunoTd = document.createElement('td');
            alunoTd.textContent = item.aluno.name;

            const conceitoTd = document.createElement('td');
            conceitoTd.textContent = item.conceito ? item.conceito.conceito : 'Sem conceito';

            tr.appendChild(alunoTd);
            tr.appendChild(conceitoTd);

            alunosList.appendChild(tr);
        });
    } catch (error) {
        console.error('Erro ao buscar alunos e conceitos:', error);
    }
}


fetchDisciplinasDaTurma();
