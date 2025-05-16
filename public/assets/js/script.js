document.addEventListener('DOMContentLoaded', () => {
    const newsContainer = document.getElementById('news-container');
    const searchInput = document.getElementById('search-input');
    const searchButton = document.getElementById('search-button');

    // Função para buscar as notícias do backend
    async function fetchNews(query = '') {
        try {
            const url = query
                ? `https://news.eternalnexus.online/articles/title/${query}`
                : 'https://news.eternalnexus.online/articles';
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error('Erro ao buscar notícias');
            }
            const articles = await response.json();
            displayNews(articles);
        } catch (error) {
            console.error('Erro:', error);
            newsContainer.innerHTML = '<p>Erro ao carregar as notícias. Tente novamente mais tarde.</p>';
        }
    }

    // Função para exibir as notícias no container
    function displayNews(articles) {
        newsContainer.innerHTML = ''; // Limpa o container
        if (articles.length === 0) {
            newsContainer.innerHTML = '<p>Nenhuma notícia encontrada.</p>';
            return;
        }
        articles.forEach(article => {
            const newsCard = document.createElement('div');
            newsCard.classList.add('news-card');

            newsCard.innerHTML = `
                <a href="article.html?slug=${article.slug}">
                    <img src="${article.cover}" alt="${article.title}">
                    <div class="news-content">
                        <h2>${article.title}</h2>
                        <p>${article.summary}</p>
                        <a href="article.html?slug=${article.slug}">Leia mais</a>
                    </div>
                </a>
            `;

            newsContainer.appendChild(newsCard);
        });
    }

    // Evento de clique no botão de pesquisa
    searchButton.addEventListener('click', () => {
        const query = searchInput.value.trim();
        fetchNews(query);
    });

    // Evento de pressionar Enter no campo de pesquisa
    searchInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            const query = searchInput.value.trim();
            fetchNews(query);
        }
    });

    // Carrega todas as notícias ao iniciar
    fetchNews();
});