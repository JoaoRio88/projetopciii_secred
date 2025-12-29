// authController.js
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
  try {
    console.log('REGISTER BODY:', req.body);

    // 1. Encriptar a password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    // 2. Criar o utilizador
    const user = new User({
      username: req.body.username,
      password: hashedPassword,
      role: req.body.role,
      nome: req.body.nome
    });

    const savedUser = await user.save();

    res.json({ user: savedUser._id, role: savedUser.role });
  } catch (err) {
    console.error('ERRO NO REGISTER:', err);
    res.status(400).json({ error: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    console.log('LOGIN BODY:', req.body);

    const { username, password } = req.body;

    if (!username || !password) {
      console.log('FALTAM CAMPOS NO LOGIN');
      return res.status(400).json({ message: 'Username e password são obrigatórios' });
    }

    // 1. Validar se o User existe
    console.log('VOU PROCURAR USER NO MONGO');
    const user = await User.findOne({ username });

    console.log('RESULTADO MONGO:', user);

    if (!user) {
      return res.status(400).json({ message: 'Utilizador não encontrado' });
    }

    // 2. Validar a Password
    const validPass = await bcrypt.compare(password, user.password);

    if (!validPass) {
      return res.status(400).json({ message: 'Password errada' });
    }

    // 3. Gerar o Token de Acesso
    // "SEGREDO_POLICIAL_123" deve ser igual ao que está no middleware/auth.js
    const token = jwt.sign(
      { _id: user._id, role: user.role },
      'SEGREDO_POLICIAL_123'
    );

    // Enviar token, role e nome para o frontend usar
    res.header('auth-token', token).json({
      token: token,
      role: user.role,
      nome: user.nome
    });
  } catch (err) {
    console.error('ERRO NO LOGIN:', err);
    res.status(500).json({ message: 'Erro interno no servidor' });
  }
};
