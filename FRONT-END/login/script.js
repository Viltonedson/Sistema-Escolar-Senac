document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    if (email && password) {
        window.location.href = '../painel/painel.html'; // Redireciona para a página painel.html
    } else {
        alert('Por favor, preencha todos os campos.');
    }
});
