const AcessoRequest = require('../models/AcessoRequest');
const User = require('../models/User');
const bcrypt = require('bcryptjs');

// Solicitar novo acesso (público)
exports.solicitarAcesso = async (req, res) => {
  try {
    const { nome, username, email, telefone, cargo, justificacao } = req.body;

    // Verificar se username já existe
    const userExiste = await User.findOne({ username });
    if (userExiste) {
      return res.status(400).json({ message: 'Username já está em uso' });
    }

    // Verificar se já existe pedido pendente para este username
    const pedidoExiste = await AcessoRequest.findOne({ 
      username, 
      status: 'pendente' 
    });
    if (pedidoExiste) {
      return res.status(400).json({ message: 'Já existe um pedido pendente para este username' });
    }

    const novoPedido = new AcessoRequest({
      nome,
      username,
      email,
      telefone,
      cargo,
      justificacao
    });

    await novoPedido.save();
    res.status(201).json({ 
      message: 'Pedido submetido com sucesso! Aguarde aprovação do administrador.',
      pedido: novoPedido 
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Listar pedidos pendentes (apenas admin)
exports.getPedidosPendentes = async (req, res) => {
  try {
    const pedidos = await AcessoRequest.find({ status: 'pendente' })
      .sort({ dataSubmissao: -1 });
    res.json(pedidos);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Listar todos os pedidos (apenas admin)
exports.getTodosPedidos = async (req, res) => {
  try {
    const pedidos = await AcessoRequest.find()
      .sort({ dataSubmissao: -1 });
    res.json(pedidos);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Aprovar pedido e criar utilizador (apenas admin)
exports.aprovarPedido = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;
    const adminNome = req.user.nome || 'Admin';

    const pedido = await AcessoRequest.findById(id);
    if (!pedido) {
      return res.status(404).json({ message: 'Pedido não encontrado' });
    }

    if (pedido.status !== 'pendente') {
      return res.status(400).json({ message: 'Este pedido já foi processado' });
    }

    // Gerar password temporária
    const passwordTemp = Math.random().toString(36).slice(-8) + 'Aa1!';
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(passwordTemp, salt);

    // Criar utilizador
    const novoUser = new User({
      username: pedido.username,
      password: hashedPassword,
      role: role,
      nome: pedido.nome
    });

    await novoUser.save();

    // Atualizar pedido
    pedido.status = 'aprovado';
    pedido.roleAtribuido = role;
    pedido.dataResposta = Date.now();
    pedido.adminResponsavel = adminNome;
    await pedido.save();

    res.json({ 
      message: 'Pedido aprovado e utilizador criado com sucesso!',
      username: pedido.username,
      passwordTemp: passwordTemp,
      role: role
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Rejeitar pedido (apenas admin)
exports.rejeitarPedido = async (req, res) => {
  try {
    const { id } = req.params;
    const adminNome = req.user.nome || 'Admin';

    const pedido = await AcessoRequest.findById(id);
    if (!pedido) {
      return res.status(404).json({ message: 'Pedido não encontrado' });
    }

    if (pedido.status !== 'pendente') {
      return res.status(400).json({ message: 'Este pedido já foi processado' });
    }

    pedido.status = 'rejeitado';
    pedido.dataResposta = Date.now();
    pedido.adminResponsavel = adminNome;
    await pedido.save();

    res.json({ message: 'Pedido rejeitado' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
