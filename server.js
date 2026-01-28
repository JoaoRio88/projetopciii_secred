require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');
const path = require('path');

const app = express();

// 1. Ligar à Base de Dados
connectDB();

// 2. Middleware JSON
app.use(express.json());

// 2.5 SERVIR FICHEIROS ESTÁTICOS (Front-End)
// Isto diz ao servidor: "Se alguém pedir um ficheiro, procura aqui primeiro".
// Como o index.html está aqui dentro, ele será carregado automaticamente na raiz "/".
app.use(express.static(path.join(__dirname, 'public')));


// 3. PASTA UPLOADS COM PERMISSÕES ESPECIAIS
app.use('/uploads', express.static(path.join(__dirname, 'uploads'), {
    setHeaders: function (res, path, stat) {
        res.set('Access-Control-Allow-Origin', '*');
        res.set('Access-Control-Allow-Methods', 'GET');
        res.set('Access-Control-Allow-Headers', 'Content-Type');
    }
}));

// 4. CORS GERAL
// (Nota: Como agora o FE e o BE estão no mesmo sítio, isto é menos crítico para
// a comunicação interna, mas podes manter para acessos externos ou testes)
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, auth-token");
    res.header("Access-Control-Expose-Headers", "auth-token");
    if (req.method === 'OPTIONS') return res.status(200).send({});
    next();
});

// 5. Rotas da API
const authRoutes = require('./routes/authRoutes');
const empresaRoutes = require('./routes/empresaRoutes');
const individuoRoutes = require('./routes/individuoRoutes');
const acessoRoutes = require('./routes/acessoRoutes');

// [REMOVIDO] A rota antiga app.get('/') que mostrava texto foi apagada
// para não entrar em conflito com o index.html da pasta public.

app.use('/api/user', authRoutes);
app.use('/api/empresas', empresaRoutes);
app.use('/api/individuos', individuoRoutes);
app.use('/api/acesso', acessoRoutes);

// 6. Iniciar
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor a correr: http://localhost:${PORT}`));
