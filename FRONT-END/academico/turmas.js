document.addEventListener('DOMContentLoaded', () => {
    const turmasList = document.getElementById('turmas-list');

    // Função para buscar turmas do backend
    async function fetchTurmas() {
        try {
            const response = await fetch('http://localhost:3000/turmas'); // Ajuste a URL conforme necessário
            if (!response.ok) {
                throw new Error('Erro ao buscar turmas');
            }

            const turmas = await response.json();
            turmasList.innerHTML = ''; // Limpar lista anterior

            // Adicionar as turmas à tabela
            turmas.forEach(turma => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>${turma.nome}</td>
                    <td>${turma.ano}</td>
                    <td>${turma.semestres}</td>
                    <td>${turma.turno}</td>
                `;
                turmasList.appendChild(tr);
            });
        } catch (error) {
            console.error('Erro ao buscar turmas:', error);
        }
    }

    // Carregar as turmas ao abrir a página
    fetchTurmas();
});
