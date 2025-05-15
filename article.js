document.addEventListener('DOMContentLoaded', () => {
    const articleContainer = document.getElementById('article-container');

    // Obtém o slug da URL
    const params = new URLSearchParams(window.location.search);
    const slug = params.get('slug');

    // Função para buscar a notícia específica
    async function fetchArticle() {
        try {
            const response = await fetch(`http://localhost:3000/articles/slug/${slug}`);
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
            <h1>${article.title}</h1>
            <img src="${article.cover}" alt="${article.title}">
            <p><strong>Autor:</strong> ${article.author}</p>
            <p><strong>Categoria:</strong> ${article.category}</p>
            <p>${article.content}</p>
        `;
    }

    // Chama a função para buscar a notícia
    fetchArticle();
});