document.addEventListener('DOMContentLoaded', () => {
    const articleContainer = document.getElementById('article-container');

    // Obtém o slug da URL
    const params = new URLSearchParams(window.location.search);
    const slug = params.get('slug');

    // Função para buscar a notícia específica
    async function fetchArticle() {
        try {
            const response = await fetch(`https://news.eternalnexus.online/articles/slug/${slug}`);
            // const response = await fetch(`http://localhost:3000/articles/slug/${slug}`);
            if (!response.ok) {
                throw new Error('Erro ao buscar a notícia');
            }
            const article = await response.json();
            displayArticle(article);
        } catch (error) {
            console.error('Erro:', error);
            articleContainer.innerHTML = '<p>Erro ao carregar a notícia. Tente novamente mais tarde.</p>';
        }
    }

    // Função para exibir a notícia
    function displayArticle(article) {
        articleContainer.innerHTML = `
            <div class="article-cover-wrapper">
                <img src="${article.cover}" alt="${article.title}" class="article-cover">
            </div>
            <div class="article-content-wrapper">
                <h1 class="article-title">${article.title}</h1>
                <div class="article-meta">
                    <span><i class="fa-solid fa-user"></i> ${article.author}</span>
                    <span><i class="fa-solid fa-tag"></i> ${article.category}</span>
                </div>
                <div class="article-content">
                    ${article.content}
                </div>
            </div>
        `;
    }

    // Chama a função para buscar a notícia
    fetchArticle();
});