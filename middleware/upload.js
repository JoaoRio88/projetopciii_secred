const multer = require('multer');
const path = require('path');

// Definir onde guardar e o nome do ficheiro
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); // Pasta de destino (tem de existir!)
    },
    filename: function (req, file, cb) {
        // Nome único: data + extensão original (ex: 1715622.jpg)
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

// Filtro para aceitar apenas imagens
const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Formato inválido. Apenas imagens (jpg, png, etc).'), false);
    }
};

const upload = multer({ 
    storage: storage,
    limits: { fileSize: 1024 * 1024 * 5 }, // Limite de 5MB
    fileFilter: fileFilter
});

module.exports = upload;