const jwt = require('jsonwebtoken');

exports.verifyToken = (req, res, next) => {
  // Procura o token em todo o lado: Header minusculo, Header maiusculo, ou Body
  const token = req.header('auth-token') || req.headers['auth-token'] || req.body.token;

  if (!token) {
      console.log("ALERTA: Tentativa de acesso sem token.");
      return res.status(401).json({ message: 'Acesso negado. Token em falta.' });
  }

  try {
    const verified = jwt.verify(token, 'SEGREDO_POLICIAL_123');
    req.user = verified;
    next();
  } catch (err) {
    console.log("ALERTA: Token inválido ou expirado.");
    res.status(400).json({ message: 'Token inválido.' });
  }
};

exports.checkRole = (rolesPermitidos) => {
  return (req, res, next) => {
    if (!rolesPermitidos.includes(req.user.role)) {
      return res.status(403).json({ message: 'Acesso Proibido: Nível insuficiente.' });
    }
    next();
  };
};