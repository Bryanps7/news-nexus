document.addEventListener('DOMContentLoaded', () => {
    const newsContainer = document.getElementById('news-container');
    const searchInput = document.getElementById('search-input');
    const searchButton = document.getElementById('search-button');

    // Debounce para pesquisa
    function debounce(func, timeout = 500) {
        let timer;
        return (...args) => {
            clearTimeout(timer);
            timer = setTimeout(() => { func.apply(this, args); }, timeout);
        };
    }

    async function fetchNews(query = '') {
        try {
            newsContainer.classList.add('loading');
            const url = query
                ? `https://news.eternalnexus.online/articles/title/${query}`
                : 'https://news.eternalnexus.online/articles';
            
            const response = await fetch(url);
            if (!response.ok) throw new Error('Erro ao buscar notícias');
            
            const articles = await response.json();
            displayNews(articles);
            
        } catch (error) {
            console.error('Erro:', error);
            newsContainer.innerHTML = `
                <div class="error-message">
                    <i class="fa-solid fa-triangle-exclamation"></i>
                    <p>Erro ao carregar as notícias. Tente novamente mais tarde.</p>
                </div>
            `;
        } finally {
            newsContainer.classList.remove('loading');
        }
    }

    function displayNews(articles) {
        newsContainer.innerHTML = articles.length ? '' : `
            <div class="empty-state">
                <i class="fa-solid fa-newspaper"></i>
                <p>Nenhuma notícia encontrada</p>
            </div>
        `;

        articles.forEach((article, index) => {
            const newsCard = document.createElement('article');
            newsCard.className = 'news-card';
            newsCard.style.animationDelay = `${index * 0.1}s`;
            newsCard.style.cursor = 'pointer';

            newsCard.innerHTML = `
                <img src="${article.cover}" alt="${article.title}" loading="lazy">
                <div class="news-content">
                    <h2>${article.title}</h2>
                    <p>${article.summary || ''}</p>
                    <a href="article.html?slug=${article.slug}" class="news-link" onclick="event.stopPropagation()">Leia mais</a>
                </div>
            `;

            // Torna o card inteiro clicável
            newsCard.addEventListener('click', () => {
                window.location.href = `article.html?slug=${article.slug}`;
            });

            newsContainer.appendChild(newsCard);
        });
    }

    // Eventos
    searchInput.addEventListener('input', debounce(() => {
        const query = searchInput.value.trim();
        fetchNews(query);
    }));

    searchButton.addEventListener('click', () => {
        const query = searchInput.value.trim();
        fetchNews(query);
    });

    // Carregar notícias iniciais
    fetchNews();
});