document.addEventListener('DOMContentLoaded', function() {
    const logoutButton = document.getElementById('logout');
    const menuItems = document.querySelectorAll('.sidebar ul li a');
    const contentArea = document.getElementById('content-area');
    const links = document.querySelectorAll('aside.sidebar a[data-section]');

    function loadPage(pageUrl) {
        fetch(pageUrl)
            .then(response => {
                if (response.ok) {
                    return response.text();
                } else {
                    throw new Error('Erro ao carregar a página: ' + pageUrl);
                }
            })
            .then(html => {
                document.getElementById('content-area').innerHTML = html;
            })
            .catch(error => {
                document.getElementById('content-area').innerHTML = '<p>Erro ao carregar a página.</p>';
                console.error(error);
            });
    }

    logoutButton.addEventListener('click', function() {
        window.location.href = '../login/index.html';
    });
    
});
