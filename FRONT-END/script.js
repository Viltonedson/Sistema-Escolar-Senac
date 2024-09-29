document.addEventListener("DOMContentLoaded", () => {
    const registerForm = document.getElementById("register-form");
    const messageDiv = document.getElementById("message");

    registerForm.addEventListener("submit", async (e) => {
        e.preventDefault(); // Evita o comportamento padrão de envio do formulário

        // Coleta os valores do formulário
        const name = document.getElementById("name").value;
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;
        const confirmpassword = document.getElementById("confirmpassword").value;
        const numerotelefone = document.getElementById("numerotelefone").value;
        const datanascimento = document.getElementById("datanascimento").value;
        const cpf = document.getElementById("cpf").value;
        const tipodeUsuario = document.getElementById("tipodeUsuario").value;


        try {
            // Enviar a requisição para o backend
            const response = await fetch("http://localhost:3000/auth/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(userData)
            });

            const data = await response.json();

            if (response.ok) {
                messageDiv.textContent = data.msg;
                messageDiv.style.color = "green";
                // Opcional: Redirecionar para outra página
                // window.location.href = "login.html";
            } else {
                messageDiv.textContent = data.msg || "Erro ao cadastrar!";
                messageDiv.style.color = "red";
            }
        } catch (error) {
            console.error("Erro ao cadastrar:", error);
            messageDiv.textContent = "Erro ao conectar ao servidor!";
            messageDiv.style.color = "red";
        }
    });
});
