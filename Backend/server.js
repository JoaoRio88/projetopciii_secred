require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');
const path = require('path');

const app = express();

// 1. Ligar à Base de Dados
connectDB();

// 2. Middleware JSON
app.use(express.json());

// 3. PASTA UPLOADS COM PERMISSÕES ESPECIAIS (CORS)
// Isto resolve o problema da foto não sair no PDF
app.use('/uploads', express.static(path.join(__dirname, 'uploads'), {
    setHeaders: function (res, path, stat) {
        res.set('Access-Control-Allow-Origin', '*');
        res.set('Access-Control-Allow-Methods', 'GET');
        res.set('Access-Control-Allow-Headers', 'Content-Type');
    }
}));

// 4. CORS GERAL (Para a API)
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, auth-token");
    res.header("Access-Control-Expose-Headers", "auth-token");
    if (req.method === 'OPTIONS') return res.status(200).send({});
    next();
});

// 5. Rotas
const authRoutes = require('./routes/authRoutes');
const empresaRoutes = require('./routes/empresaRoutes');
const individuoRoutes = require('./routes/individuoRoutes');

app.get('/', (req, res) => {
    res.send('Servidor a funcionar! Tenta as rotas da API.');
});

app.use('/api/user', authRoutes);
app.use('/api/empresas', empresaRoutes);
app.use('/api/individuos', individuoRoutes);

// 6. Iniciar
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`http://localhost:${PORT}`));