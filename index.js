const express = require('express');
const cors = require('cors');
const server = express();

const db = require('./backend/db/Conn')
const Article = require('./backend/model/Article')

const PORT = 3000;

server.use(express.urlencoded({ extended: true }));
server.use(express.json());
server.use(cors());

// -------------------------------------

// Apagar o Artigo por slug
server.delete('/articles/slug/:slug', async (req, res) => {
    const { slug } = req.params;

    try {
        const article = await Article.findOne({ where: { slug } });
        if (!article) {
            return res.status(404).json({ error: 'Artigo não encontrado' });
        }
        await article.destroy();
        res.json({ message: 'Artigo apagado com sucesso' });
    } catch (error) {
        console.error('Erro ao apagar artigo:', error);
        res.status(500).json({ error: 'Erro ao apagar artigo' });
    }
});

// Atualizar Artigo por slug
server.put('/articles/slug/:slug', async (req, res) => {
    const { slug } = req.params;
    const { cover, category, content, author, summary, title, published } = req.body;

    try {
        const article = await Article.findOne({ where: { slug } });
        if (!article) {
            return res.status(404).json({ error: 'Artigo não encontrado' });
        }
        await article.update({ cover, category, content, author, summary, title, published });
        res.json({ message: 'Artigo atualizado com sucesso' });
    } catch (error) {
        console.error('Erro ao atualizar artigo:', error);
        res.status(500).json({ error: 'Erro ao atualizar artigo' });
    }
});

// Buscar Artigo por SLUG
server.get('/articles/slug/:slug', async (req, res) => {
    const { slug } = req.params;

    try {
        const article = await Article.findOne({ where: { slug } });
        if (!article) {
            return res.status(404).json({ error: 'Artigo não encontrado' });
        }
        res.json(article);
    } catch (error) {
        console.error('Erro ao buscar artigo:', error);
        res.status(500).json({ error: 'Erro ao buscar artigo' });
    }
});



// Buscar Artigo que contenha no TITLE
server.get('/articles/title/:title', async (req, res) => {
    const { title } = req.params;

    try {
        const articles = await Article.findAll({ where: { title: { [db.Sequelize.Op.like]: `%${title}%` } } });
        res.json(articles);
    } catch (error) {
        console.error('Erro ao buscar artigos:', error);
        res.status(500).json({ error: 'Erro ao buscar artigos' });
    }
});

// Cadastrar Artigo
server.post('/articles', async (req, res) => {
    const { title, cover, category, content, author, summary, slug, published } = req.body;

    try {
        const article = await Article.create({ title, cover, category, content, author, summary, slug, published });
        res.status(201).json(article);
    } catch (error) {
        console.error('Erro ao cadastrar artigo:', error);
        res.status(500).json({ error: 'Erro ao cadastrar artigo' });
    }
});

// Buscar Todos os Artigos
server.get('/articles', async (req, res) => {
    try {
        const articles = await Article.findAll();
        res.json(articles);
    } catch (error) {
        console.error('Erro ao buscar artigos:', error);
        res.status(500).json({ error: 'Erro ao buscar artigos' });
    }
});

// -------------------------------------
// Teste
server.get('/', (req, res) => {
    res.send('Hello World!');
});

// -------------------------------------

server.listen(PORT, () => {
    console.log(`Servidor rodando na porta http://localhost:${PORT}`);

    db.sync({ force: false })
        .then(() => {
            console.log('Conectado ao banco de dados');
        })
        .catch((error) => {
            console.error('Erro ao conectar ao banco de dados:', error);
        });
});