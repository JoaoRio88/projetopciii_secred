// backend/seed.js
require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User'); // Certifica-te que o caminho está certo
const connectDB = require('./config/db');

const criarUtilizadores = async () => {
    await connectDB();

    // 1. Limpar utilizadores antigos (opcional, cuidado em produção!)
    await User.deleteMany({}); 

    // 2. Definir as passwords
    const salt = await bcrypt.genSalt(10);
    const passAdmin = await bcrypt.hash('admin123', salt);
    const passSec = await bcrypt.hash('sec123', salt);
    const passPatrulha = await bcrypt.hash('patrulha123', salt);

    // 3. Criar os utilizadores
    const users = [
        {
            username: 'comandante',
            password: passAdmin,
            role: 'admin',
            nome: 'Comandante Silva'
        },
        {
            username: 'secretaria',
            password: passSec,
            role: 'secretariado',
            nome: 'Agente Marta (Secretariado)'
        },
        {
            username: 'patrulha01',
            password: passPatrulha,
            role: 'patrulha',
            nome: 'Agente Costa'
        }
    ];

    try {
        await User.insertMany(users);
        console.log('✅ Utilizadores criados com sucesso!');
        console.log('-----------------------------------');
        console.log('Admin:      comandante / admin123');
        console.log('Secretaria: secretaria / sec123');
        console.log('Patrulha:   patrulha01 / patrulha123');
        console.log('-----------------------------------');
        process.exit();
    } catch (error) {
        console.error('Erro:', error);
        process.exit(1);
    }
};

criarUtilizadores();