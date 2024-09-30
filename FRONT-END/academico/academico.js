const turmaForm = document.getElementById('turma-form');
const disciplinaForm = document.getElementById('disciplina-form');
const conceitoForm = document.getElementById('conceito-form');

const turmaNomeInput = document.getElementById('turma-nome');
const turmaSelect = document.getElementById('turma-select');
const turmaList = document.getElementById('turma-list');

const disciplinaNomeInput = document.getElementById('disciplina-nome');
const disciplinaSelect = document.getElementById('disciplina-select');
const disciplinaList = document.getElementById('disciplina-list');

const alunoNomeInput = document.getElementById('aluno-nome');
const notaInput = document.getElementById('nota');
const conceitoList = document.getElementById('conceito-list');


let turmas = [];
let disciplinas = [];
let conceitos = [];


function renderizarTurmas() {
    turmaList.innerHTML = '';
    turmaSelect.innerHTML = '<option value="" disabled selected>Selecione uma turma</option>';

    turmas.forEach(turma => {
        const li = document.createElement('li');
        li.textContent = turma.nome;
        turmaList.appendChild(li);

        const option = document.createElement('option');
        option.value = turma.nome;
        option.textContent = turma.nome;
        turmaSelect.appendChild(option);
    });
}


function renderizarDisciplinas() {
    disciplinaList.innerHTML = '';
    disciplinaSelect.innerHTML = '<option value="" disabled selected>Selecione uma disciplina</option>';

    disciplinas.forEach(disciplina => {
        const li = document.createElement('li');
        li.textContent = `${disciplina.nome} (Turma: ${disciplina.turma})`;
        disciplinaList.appendChild(li);

        const option = document.createElement('option');
        option.value = disciplina.nome;
        option.textContent = `${disciplina.nome} (Turma: ${disciplina.turma})`;
        disciplinaSelect.appendChild(option);
    });
}


function renderizarConceitos() {
    conceitoList.innerHTML = '';

    conceitos.forEach(conceito => {
        const li = document.createElement('li');
        li.textContent = `Aluno: ${conceito.aluno} | Disciplina: ${conceito.disciplina} | Nota: ${conceito.nota}`;
        conceitoList.appendChild(li);
    });
}


turmaForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const turmaNome = turmaNomeInput.value;
    turmas.push({ nome: turmaNome });
    turmaNomeInput.value = '';

    renderizarTurmas();
});


disciplinaForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const disciplinaNome = disciplinaNomeInput.value;
    const turmaNome = turmaSelect.value;
    disciplinas.push({ nome: disciplinaNome, turma: turmaNome });
    disciplinaNomeInput.value = '';
    turmaSelect.value = '';

    renderizarDisciplinas();
});


conceitoForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const alunoNome = alunoNomeInput.value;
    const disciplinaNome = disciplinaSelect.value;
    const nota = notaInput.value;
    conceitos.push({ aluno: alunoNome, disciplina: disciplinaNome, nota: nota });
    alunoNomeInput.value = '';
    disciplinaSelect.value = '';
    notaInput.value = '';

    renderizarConceitos();
});


renderizarTurmas();
renderizarDisciplinas();
renderizarConceitos();
