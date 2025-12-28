const express = require('express');
const router = express.Router();
const empresaController = require('../controllers/empresaController');
const { verifyToken, checkRole } = require('../middleware/auth');
const upload = require('../middleware/upload'); // Importante!

// Rotas
router.get('/', verifyToken, empresaController.getEmpresas);
router.get('/:id', verifyToken, empresaController.getEmpresaById);

// POST com Upload: upload.single('foto') deve bater certo com o frontend
router.post('/', [verifyToken, checkRole(['admin', 'secretariado']), upload.single('foto')], empresaController.createEmpresa);

// PUT com Upload
router.put('/:id', [verifyToken, checkRole(['admin', 'secretariado']), upload.single('foto')], empresaController.updateEmpresa);

router.delete('/:id', [verifyToken, checkRole(['admin'])], empresaController.deleteEmpresa);

module.exports = router;