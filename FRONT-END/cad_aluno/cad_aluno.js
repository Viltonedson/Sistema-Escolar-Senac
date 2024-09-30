document.getElementById('cadastroAlunoForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const nome = document.getElementById('nome').value;
    const email = document.getElementById('email').value;
    const turma = document.getElementById('turma').value;
    const turno = document.getElementById('turno').value;

    if (nome && email && turma && turno) {
        const alunoItem = `${nome} - Email: ${email}, Turma: ${turma}, Turno: ${turno}`;
        
        const li = document.createElement('li');
        li.textContent = alunoItem;
        document.getElementById('alunosLista').appendChild(li);
        
        document.getElementById('cadastroAlunoForm').reset();
    } else {
        alert('Por favor, preencha todos os campos.');
    }
});
