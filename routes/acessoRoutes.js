const express = require('express');
const router = express.Router();
const acessoController = require('../controllers/acessoController');
const { verifyToken, checkRole } = require('../middleware/auth');

// Rota pública - qualquer pessoa pode solicitar acesso
router.post('/solicitar', acessoController.solicitarAcesso);

// Rotas protegidas - apenas admin
router.get('/pendentes', verifyToken, checkRole(['admin']), acessoController.getPedidosPendentes);
router.get('/todos', verifyToken, checkRole(['admin']), acessoController.getTodosPedidos);
router.put('/aprovar/:id', verifyToken, checkRole(['admin']), acessoController.aprovarPedido);
router.put('/rejeitar/:id', verifyToken, checkRole(['admin']), acessoController.rejeitarPedido);

module.exports = router;