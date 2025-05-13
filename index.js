const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const server = express();

const db = require('./backend/db/Conn')
const Article = require('./backend/model/Article')

const PORT = 3000;

server.use(express.urlencoded({ extended: true }));
server.use(express.json());
server.use(cors());

// -------------------------------------
// Configuração do multer para o armazenamento de arquivos
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Define o diretório de destino no servidor Plesk
    cb(null, './images/');
  },
  filename: (req, file, cb) => {
    // Define o nome do arquivo
    cb(null, Date.now() + path.extname(file.originalname)); // Adiciona timestamp ao nome do arquivo
  }
});

const upload = multer({ storage: storage });

// Endpoint para upload da imagem
server.post('/images', upload.single('image'), (req, res) => {
  // O arquivo estará disponível em req.file
  if (!req.file) {
    return res.status(400).send('Nenhuma imagem foi enviada.');
  }
  res.send({
    message: 'Imagem carregada com sucesso!',
    file: req.file
  });
});

// -------------------------------------

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

// Atualizar Artigo por TITLE
server.put('/articles/title/:title', async (req, res) => {
    const { title } = req.params;
    const { cover, category, content, author, summary, slug, published } = req.body;

    try {
        const article = await Article.findOne({ where: { title } });
        if (!article) {
            return res.status(404).json({ error: 'Artigo não encontrado' });
        }
        await article.update({ cover, category, content, author, summary, slug, published });
        res.json({ message: 'Artigo atualizado com sucesso' });
    } catch (error) {
        console.error('Erro ao atualizar artigo:', error);
        res.status(500).json({ error: 'Erro ao atualizar artigo' });
    }
});

// Apagar o Artigo por TITLE
server.delete('/articles/title/:title', async (req, res) => {
    const { title } = req.params;

    try {
        const article = await Article.findOne({ where: { title } });
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

// Buscar Artigo por TITLE
server.get('/articles/title/:title', async (req, res) => {
    const { title } = req.params;

    try {
        const article = await Article.findOne({ where: { title } });
        if (!article) {
            return res.status(404).json({ error: 'Artigo não encontrado' });
        }
        res.json(article);
    } catch (error) {
        console.error('Erro ao buscar artigo:', error);
        res.status(500).json({ error: 'Erro ao buscar artigo' });
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