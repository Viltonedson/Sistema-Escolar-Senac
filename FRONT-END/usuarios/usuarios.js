const users = [];
let editingIndex = null; 
document.getElementById('registerUserForm').addEventListener('submit', async function(event) {
    event.preventDefault(); 

    
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const numerotelefone = document.getElementById('numerotelefone').value;
    const datanascimento = document.getElementById('datanascimento').value;
    const cpf = document.getElementById('cpf').value;
    const tipodeUsuario = document.getElementById('tipodeUsuario').value;

    
// Criação de um objeto com os dados
    const userData = {
        name,
        email,
        password,
        confirmpassword: password,
        numerotelefone,
        datanascimento,
        cpf,
        tipodeUsuario
    };
    
    try {
        // Fazendo a requisição POST para o back-end
        const response = await fetch('http://localhost:3000/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData)  // Convertendo os dados do usuário para JSON
        });

        const result = await response.json();  // Parse da resposta como JSON

        if (response.ok) {
            alert(result.msg);  // Exibe mensagem de sucesso
        } else {
            alert(result.msg);  // Exibe mensagem de erro
        }

    } catch (error) {
        console.error('Erro ao cadastrar usuário:', error);
        alert('Erro ao tentar cadastrar o usuário. Tente novamente.');
    }
});


    if (editingIndex !== null) {
        
        users[editingIndex] = { name, email, password, numerotelefone, datanascimento, cpf, tipodeUsuario };
        editingIndex = null; 
    } else {
        
        const user = { name, email, password, numerotelefone, datanascimento, cpf, tipodeUsuario };
        users.push(user);
    }

    
    updateUsersTable();

function updateUsersTable() {
    const tbody = document.getElementById('usersTable').getElementsByTagName('tbody')[0];
    tbody.innerHTML = ''; 

    users.forEach((user, index) => {
        const row = tbody.insertRow();
        row.insertCell(0).innerText = user.name;
        row.insertCell(1).innerText = user.email;
        row.insertCell(2).innerText = user.password;
        row.insertCell(3).innerText = user.numerotelefone;
        row.insertCell(4).innerText = user.datanascimento;
        row.insertCell(5).innerText = user.cpf;
        row.insertCell(6).innerText = user.tipodeUsuario;

        
        const editCell = row.insertCell(7);
        const editButton = document.createElement('button');
        editButton.innerText = 'Editar';
        editButton.onclick = function() {
            editUser(index); 
        };
        editCell.appendChild(editButton);

       
        const deleteCell = row.insertCell(8);
        const deleteButton = document.createElement('button');
        deleteButton.innerText = 'Excluir';
        deleteButton.onclick = function() {
            users.splice(index, 1); 
            updateUsersTable(); 
        };
        deleteCell.appendChild(deleteButton);
    });
}

function editUser(index) {
    const user = users[index];
    document.getElementById('name').value = user.username;
    document.getElementById('email').value = user.email;
    document.getElementById('password').value = user.password;
    document.getElementById('numerotelelfone').value = user.numerotelefone;
    document.getElementById('datanascimento').value = user.datanascimento;
    document.getElementById('cpf').value = user.cpf;
    document.getElementById('tipodeUsuario').value = user.tipodeUsuario;

    editingIndex = index; 
}