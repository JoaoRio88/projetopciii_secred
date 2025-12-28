const express = require('express');
const router = express.Router();
const individuoController = require('../controllers/individuoController');
const { verifyToken, checkRole } = require('../middleware/auth');
const upload = require('../middleware/upload'); 

router.get('/', verifyToken, individuoController.getIndividuos);
router.get('/:id', verifyToken, individuoController.getIndividuoById);

router.post('/', [verifyToken, checkRole(['admin', 'secretariado']), upload.single('foto')], individuoController.createIndividuo);

router.put('/:id', [verifyToken, checkRole(['admin', 'secretariado']), upload.single('foto')], individuoController.updateIndividuo);

router.delete('/:id', [verifyToken, checkRole(['admin'])], individuoController.deleteIndividuo);

module.exports = router;