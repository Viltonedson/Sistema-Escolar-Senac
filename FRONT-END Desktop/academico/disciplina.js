document.addEventListener('DOMContentLoaded', () => {
    const disciplinaList = document.getElementById('disciplina-list');
    const alocarModal = document.getElementById('alocarModal');
    const closeModal = document.getElementById('closeModal');
    let selectedDisciplinaId = null;
    const alocarProfessoresButton = document.getElementById('alocarProfessoresButton');
 


    // Buscar disciplinas e exibir na lista
    async function fetchDisciplinas() {
        const response = await fetch('http://localhost:3000/Disciplinas');
        const disciplinas = await response.json();
        disciplinaList.innerHTML = '';

        disciplinas.forEach(disciplina => {
            const li = document.createElement('li');
            li.textContent = disciplina.nome;
            li.dataset.id = disciplina._id;

            // Ao clicar em uma disciplina, abrir o modal de alocação
            li.addEventListener('click', () => {
                selectedDisciplinaId = disciplina._id;
                alocarModal.style.display = 'block';
                fetchProfessores();
            });

            disciplinaList.appendChild(li);
        });
    }
    
    // Buscar professores e popular o select
    async function fetchProfessores() {
        try {
            const response = await fetch('http://localhost:3000/users?tipodeUsuario=Professor');
            if (!response.ok) {
                throw new Error('Erro ao buscar professores');
            }
            const professores = await response.json();
            const professoresSelect = document.getElementById('professoresDisciplina');
            professoresSelect.innerHTML = ''; // Limpar opções anteriores
    
            professores.forEach(professor => {
                const option = document.createElement('option');
                option.value = professor._id; // ID do professor
                option.textContent = professor.name; // Nome do professor
                professoresSelect.appendChild(option);
            });
        } catch (error) {
            console.error('Erro ao buscar professores:', error);
        }
    }
    
   
    // Fechar modal
    closeModal.onclick = function() {
        alocarModal.style.display = 'none';
    };

    // Fechar modal ao clicar fora dele
    window.onclick = function(event) {
        if (event.target == alocarModal) {
            alocarModal.style.display = 'none';
        }
    };

    // Enviar dados de alocação de professores para o backend
    document.getElementById('alocarForm').addEventListener('submit', async (event) => {
        event.preventDefault();
        const professoresSelect = document.getElementById('professoresDisciplina');

        if (!professoresSelect) {
            console.error('Elemento "professoresDisciplina" não encontrado.');
            return;
        }

        const selectedProfessores = Array.from(professoresSelect.selectedOptions).map(option => option.value);
        const alocacaoData = {
            disciplinaId: selectedDisciplinaId,
            professores: selectedProfessores,
        };

        try {
            const response = await fetch('http://localhost:3000/ProfessorDisciplinas', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(alocacaoData)
            });

            if (response.ok) {
                alert('Professores alocados com sucesso!');
                alocarModal.style.display = 'none';
            } else {
                alert('Erro ao alocar professores.');
            }
        } catch (error) {
            console.error('Erro ao alocar professores:', error);
        }
    });

// Carregar as disciplinas ao abrir a página
    fetchDisciplinas();
});
