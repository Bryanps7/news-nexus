document.addEventListener('DOMContentLoaded', () => {
    const loginContainer = document.getElementById('login-container');
    const adminContainer = document.getElementById('admin-container');
    const loginForm = document.getElementById('login-form');
    const errorMessage = document.getElementById('error-message');
    const logoutButton = document.getElementById('logout-button');
    const articleForm = document.getElementById('article-form');
    const articlesList = document.getElementById('articles-list');

    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');

    const API_URL = 'https://news.eternalnexus.online/articles';

    // Login
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const username = usernameInput.value.trim();
        const password = passwordInput.value.trim();

        if (username === 'dudscria' && password === '1234') {
            loginContainer.classList.add('hidden');
            adminContainer.classList.remove('hidden');
            loadArticles();
        } else {
            errorMessage.textContent = 'Usuário ou senha incorretos!';
        }
    });

    // Logout
    logoutButton.addEventListener('click', () => {
        adminContainer.classList.add('hidden');
        loginContainer.classList.remove('hidden');
        loginForm.reset();
    });

    // Carregar matérias
    async function loadArticles() {
        try {
            const response = await fetch(API_URL);
            const articles = await response.json();
            displayArticles(articles);
        } catch (error) {
            console.error('Erro ao carregar matérias:', error);
        }
    }

    // Exibir matérias
    function displayArticles(articles) {
        articlesList.innerHTML = '';
        articles.forEach(article => {
            const articleItem = document.createElement('div');
            articleItem.classList.add('article-item');
            articleItem.innerHTML = `
                <span>${article.title}</span>
                <div>
                    <button onclick="editArticle('${article.slug}')">Editar</button>
                    <button onclick="deleteArticle('${article.slug}')">Apagar</button>
                </div>
            `;
            articlesList.appendChild(articleItem);
        });
    }

    // Gerar slug automaticamente
    function generateSlug(title) {
        return title
            .toLowerCase()
            .trim()
            .replace(/[^a-z0-9]+/g, '-') // Substitui caracteres não alfanuméricos por "-"
            .replace(/^-+|-+$/g, ''); // Remove "-" do início ou fim
    }

    // Cadastrar ou atualizar matéria
    articleForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const id = document.getElementById('article-id').value;
        const title = document.getElementById('title').value;
        const articleData = {
            title,
            cover: document.getElementById('cover').value,
            category: document.getElementById('category').value,
            content: document.getElementById('content').value,
            author: document.getElementById('author').value,
            summary: document.getElementById('summary').value,
            slug: generateSlug(title), // Gera o slug automaticamente
            published: true, // Sempre publicado
        };

        try {
            const method = id ? 'PUT' : 'POST';
            const url = id ? `${API_URL}/slug/${id}` : API_URL;
            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(articleData),
            });
            if (response.ok) {
                loadArticles();
                articleForm.reset();
            }
        } catch (error) {
            console.error('Erro ao salvar matéria:', error);
        }
    });

    // Apagar matéria com confirmação
    window.deleteArticle = async (slug) => {
        const confirmDelete = confirm('Tem certeza de que deseja apagar esta matéria?');
        if (!confirmDelete) {
            return; // Cancela a exclusão se o usuário clicar em "Cancelar"
        }

        try {
            const response = await fetch(`${API_URL}/slug/${slug}`, { method: 'DELETE' });
            if (response.ok) {
                loadArticles();
            } else {
                console.error('Erro ao apagar matéria:', response.statusText);
            }
        } catch (error) {
            console.error('Erro ao apagar matéria:', error);
        }
    };

    // Editar matéria
    window.editArticle = async (slug) => {
        try {
            const response = await fetch(`${API_URL}/slug/${slug}`);
            const article = await response.json();
            document.getElementById('article-id').value = article.slug; // Usando o slug como identificador
            document.getElementById('title').value = article.title;
            document.getElementById('cover').value = article.cover;
            document.getElementById('category').value = article.category;
            document.getElementById('content').value = article.content;
            document.getElementById('author').value = article.author;
            document.getElementById('summary').value = article.summary;
        } catch (error) {
            console.error('Erro ao carregar matéria para edição:', error);
        }
    };
});