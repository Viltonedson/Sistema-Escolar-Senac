const alunoForm = document.getElementById('aluno-form');
const notaForm = document.getElementById('nota-form');
const presencaForm = document.getElementById('presenca-form');

const alunoNomeInput = document.getElementById('aluno-nome');
const alunoNotaSelect = document.getElementById('aluno-nota-select');
const alunoPresencaSelect = document.getElementById('aluno-presenca-select');
const notaInput = document.getElementById('nota');
const presencaStatusSelect = document.getElementById('presenca-status');

const alunoList = document.getElementById('aluno-list');
const notaList = document.getElementById('nota-list');
const presencaList = document.getElementById('presenca-list');
const estatisticasList = document.getElementById('estatisticas-list');
const erroAluno = document.getElementById('erro-aluno');

let alunos = [];
let notas = [];
let presencas = [];


function renderizarAlunos() {
    alunoList.innerHTML = '';
    alunoNotaSelect.innerHTML = '<option value="" disabled selected>Selecione um aluno</option>';
    alunoPresencaSelect.innerHTML = '<option value="" disabled selected>Selecione um aluno</option>';

    alunos.forEach(aluno => {
        const li = document.createElement('li');
        li.textContent = aluno.nome;
        alunoList.appendChild(li);

        const optionNota = document.createElement('option');
        optionNota.value = aluno.nome;
        optionNota.textContent = aluno.nome;
        alunoNotaSelect.appendChild(optionNota);

        const optionPresenca = document.createElement('option');
        optionPresenca.value = aluno.nome;
        optionPresenca.textContent = aluno.nome;
        alunoPresencaSelect.appendChild(optionPresenca);
    });
}


function renderizarNotas() {
    notaList.innerHTML = '';

    notas.forEach(nota => {
        const li = document.createElement('li');
        li.textContent = `Aluno: ${nota.aluno} | Nota: ${nota.nota}`;
        notaList.appendChild(li);
    });
}


function renderizarPresencas() {
    presencaList.innerHTML = '';

    presencas.forEach(presenca => {
        const li = document.createElement('li');
        li.textContent = `Aluno: ${presenca.aluno} | Status: ${presenca.status}`;
        presencaList.appendChild(li);
    });
}


function calcularEstatisticas() {
    estatisticasList.innerHTML = '';

    alunos.forEach(aluno => {
        const notasAluno = notas.filter(nota => nota.aluno === aluno.nome).map(nota => parseFloat(nota.nota));
        const mediaNota = notasAluno.length > 0 ? (notasAluno.reduce((a, b) => a + b, 0) / notasAluno.length).toFixed(2) : 'Sem notas';

        const presencasAluno = presencas.filter(presenca => presenca.aluno === aluno.nome);
        const totalPresencas = presencasAluno.length;
        const presencasPositivas = presencasAluno.filter(presenca => presenca.status === 'Presente').length;
        const taxaPresenca = totalPresencas > 0 ? ((presencasPositivas / totalPresencas) * 100).toFixed(2) + '%' : 'Sem presença';

        const li = document.createElement('li');
        li.textContent = `Aluno: ${aluno.nome} | Média de Notas: ${mediaNota} | Taxa de Presença: ${taxaPresenca}`;
        estatisticasList.appendChild(li);
    });
}


function validarAlunoDuplicado(nome) {
    return alunos.some(aluno => aluno.nome.toLowerCase() === nome.toLowerCase());
}


alunoForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const alunoNome = alunoNomeInput.value.trim();

    if (validarAlunoDuplicado(alunoNome)) {
        erroAluno.textContent = 'O aluno já está cadastrado!';
    } else {
        erroAluno.textContent = '';
        alunos.push({ nome: alunoNome });
        alunoNomeInput.value = '';
        renderizarAlunos();
        calcularEstatisticas();
    }
});


notaForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const alunoNome = alunoNotaSelect.value;
    const nota = notaInput.value;
    notas.push({ aluno: alunoNome, nota: nota });
    notaInput.value = '';
    alunoNotaSelect.value = '';

    renderizarNotas();
    calcularEstatisticas();
});


presencaForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const alunoNome = alunoPresencaSelect.value;
    const status = presencaStatusSelect.value;
    presencas.push({ aluno: alunoNome, status: status });
    alunoPresencaSelect.value = '';
    presencaStatusSelect.value = '';

    renderizarPresencas();
    calcularEstatisticas();
});


renderizarAlunos();
renderizarNotas();
renderizarPresencas();
calcularEstatisticas();
