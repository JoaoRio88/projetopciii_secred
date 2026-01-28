const express = require('express');
const router = express.Router();
const individuoController = require('../controllers/individuoController');
const { verifyToken, checkRole } = require('../middleware/auth');
const upload = require('../middleware/upload');

// LISTAR
router.get('/', verifyToken, individuoController.getIndividuos);

// PESQUISA (tem de vir ANTES do "/:id")
router.get('/pesquisa', verifyToken, individuoController.searchIndividuos);

// GET por ID
router.get('/:id', verifyToken, individuoController.getIndividuoById);

// CRUD
router.post(
  '/',
  [verifyToken, checkRole(['admin', 'secretariado']), upload.single('foto')],
  individuoController.createIndividuo
);

router.put(
  '/:id',
  [verifyToken, checkRole(['admin', 'secretariado']), upload.single('foto')],
  individuoController.updateIndividuo
);

router.delete(
  '/:id',
  [verifyToken, checkRole(['admin'])],
  individuoController.deleteIndividuo
);

module.exports = router;
