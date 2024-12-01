document.addEventListener('DOMContentLoaded', async () => {
    const turmasList = document.getElementById('turmas-list');

    // Função para buscar turmas do backend
    async function fetchTurmas() {
        try {
            const response = await fetch('http://localhost:3000/turmas');
            const turmas = await response.json();
            
            turmas.forEach(turma => {
                const tr = document.createElement('tr');
                
                // Criando as células da tabela
                const nomeTd = document.createElement('td');
                const anoTd = document.createElement('td');
                const semestreTd = document.createElement('td');
                const turnoTd = document.createElement('td');
                
                // Preenchendo os valores nas células
                nomeTd.textContent = turma.nome;
                anoTd.textContent = turma.ano;
                semestreTd.textContent = turma.semestre;
                turnoTd.textContent = turma.turno;

                // Adiciona um evento de clique na linha para redirecionar
                tr.addEventListener('click', () => {
                    // Redireciona para a página de detalhes da turma
                    window.location.href = `alunosturmas.html?turmaId=${turma._id}`;
                });

                // Adiciona as células à linha
                tr.appendChild(nomeTd);
                tr.appendChild(anoTd);
                tr.appendChild(semestreTd);
                tr.appendChild(turnoTd);

                // Adiciona a linha à tabela
                turmasList.appendChild(tr);
            });
        } catch (error) {
            console.error('Erro ao buscar turmas:', error);
        }
    }

    // Buscar e exibir as turmas ao carregar a página
    fetchTurmas();
});
