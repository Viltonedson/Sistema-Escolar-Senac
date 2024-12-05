document.getElementById("loginForm").addEventListener("submit", async function(event) {
    event.preventDefault(); 

    // Obter os valores dos campos de e-mail e senha
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    // Montar o objeto com os dados do login
    const loginData = {
        email: email,
        password: password
    };

    try {
        // Fazer uma requisição para a rota de login no back-end
        const response = await fetch('http://localhost:3000/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(loginData)
        });

        const data = await response.json();

        if (response.ok) {
            // Salvar token e dados do usuário
            if (data.token) {
                localStorage.setItem('token', data.token);
                localStorage.setItem('userId', data.id);
                localStorage.setItem('userEmail', email);
            }
            
            // Redirecionar para o painel
            window.location.href = '../painel/painel.html';
        } else {
            throw new Error(data.msg || 'Erro ao fazer login');
        }
    } catch (error) {
        console.error('Erro:', error);
        alert(error.message || 'Ocorreu um erro ao tentar fazer login. Por favor, tente novamente.');
    }
});
