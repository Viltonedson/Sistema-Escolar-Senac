function adicionarCadastro(formId, listaId) {
    document.getElementById(formId).addEventListener('submit', function(event) {
        event.preventDefault();

        const nome = this.nome.value;
        const email = this.email.value;
        const telefone = this.telefone.value;

        const li = document.createElement('li');
        li.textContent = `Nome: ${nome}, Email: ${email}, Telefone: ${telefone}`;
        document.getElementById(listaId).appendChild(li);

        this.reset();
    });
}


if (document.getElementById('cadastroAlunos')) {
    adicionarCadastro('cadastroAlunos', 'listaAlunos');
} else if (document.getElementById('cadastroProfessores')) {
    adicionarCadastro('cadastroProfessores', 'listaProfessores');
}
