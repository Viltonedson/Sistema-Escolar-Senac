// Selecionar o botão e o formulário
const showFormButton = document.getElementById('showFormButton');
const registerUserForm = document.getElementById('registerUserForm');

// Adicionar evento de clique no botão
showFormButton.addEventListener('click', () => {
    // Verificar se o formulário está visível ou escondido
    if (registerUserForm.style.display === 'none') {
        // Mostrar o formulário
        registerUserForm.style.display = 'block';
        showFormButton.textContent = 'Fechar Formulário'; // Alterar o texto do botão
    } else {
        // Esconder o formulário
        registerUserForm.style.display = 'none';
        showFormButton.textContent = 'Cadastrar Novo Usuário'; // Alterar o texto do botão
    }
});
//=====================================================================================

const users = [];
let editingUserId = null; 
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
        if (editingUserId) {
            
            // Atualizar o usuário no back-end via PUT
            const response = await fetch(`http://localhost:3000/user/${editingUserId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(userData)
            });

            if (response.ok) {
                alert('Usuário atualizado com sucesso.');
                editingUserId = null;
                clearForm();
                fetchUsers();
            } else {
                alert('Erro ao atualizar o usuário.');
            }
        } else {

        // Fazendo a requisição POST para o back-end
        const response = await fetch('http://localhost:3000/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData)  // Convertendo os dados do usuário para JSON
        });

          // Parse da resposta como JSON

        if (response.ok) {
            const result = await response.json();
            alert(result.msg || 'Usuário cadastrado com sucesso.');
            clearForm();
            fetchUsers();
        } else {
            alert(result.msg || 'Erro ao cadastrar usuário.');
        }
     }
    }  catch (error) {
        console.error('Erro ao atualizar usuário:', error);
        alert('Erro ao tentar atualizar o usuário. Tente novamente.');
    }
});

//=====
async function fetchUsers() {
    try {
        const response = await fetch('http://localhost:3000/users', {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('token') //  armazena o token no localStorage após o login
            }
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const users = await response.json();
        populateUsersTable(users);
    } catch (error) {
        console.error('Erro ao buscar usuários:', error);
        alert('Erro ao buscar usuários. Por favor, verifique se você está autenticado e tente novamente.');
    }
}

function populateUsersTable(users) {
    const tbody = document.getElementById('usersTable').getElementsByTagName('tbody')[0];
    tbody.innerHTML = '';

    if (users.length === 0) {
        const row = tbody.insertRow();
        const cell = row.insertCell(0);
        cell.colSpan = 6;
        cell.innerText = 'Nenhum usuário cadastrado.';
        return;
    }

    users.forEach((user, index) => {
        const row = tbody.insertRow();
        row.insertCell(0).innerText = user.name || 'Nome não informado';
        row.insertCell(1).innerText = user.email || 'E-mail não informado';
        row.insertCell(2).innerText = user.numerotelefone || 'Telefone não informado';
        row.insertCell(3).innerText = user.cpf || 'CPF não informado';
        row.insertCell(4).innerText = user.datanascimento || 'Data Não Informada';
        row.insertCell(5).innerText = user.tipodeUsuario || 'Função não informada';

        const actionCell = row.insertCell(6);

        const editButton = document.createElement('button');
        editButton.innerText = 'Editar';
        editButton.onclick = function() {
            editUser(user);
        };
        actionCell.appendChild(editButton);

        const deleteButton = document.createElement('button');
        deleteButton.innerText = 'Excluir';
        deleteButton.onclick = function() {
            deleteUser(user._id);
        };
        actionCell.appendChild(deleteButton);
    });
}

async function deleteUser(userId) {
    try {
        const response = await fetch(`http://localhost:3000/users/${userId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            alert('Usuário excluído com sucesso.');
            fetchUsers()
        } else {
            alert('Erro ao excluir o usuário.');
        }
    } catch (error) {
        console.error('Erro ao excluir usuário:', error);
        alert('Erro ao tentar excluir o usuário. Tente novamente.');
    }
}

async function editUser(user) {
    document.getElementById('name').value = user.name;
    document.getElementById('email').value = user.email;
    document.getElementById('password').value = user.password;
    document.getElementById('confirmpassword').value = user.password;
    document.getElementById('numerotelefone').value = user.numerotelefone;
    const formattedDate = new Date(user.datanascimento).toISOString().split('T')[0];
    document.getElementById('datanascimento').value = formattedDate;
    document.getElementById('cpf').value = user.cpf;
    document.getElementById('tipodeUsuario').value = user.tipodeUsuario;
    
    editingUserId = user._id;
    document.getElementById('registerUserForm').style.display = 'block';
    };


document.addEventListener('DOMContentLoaded', async function() {
    await fetchUsers();
});

function clearForm() {
    document.getElementById('registerUserForm').reset();
    editingUserId = null;
}