const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');

// Middleware para validar el token
const authenticateToken = (req, res, next) => {
  // Intenta obtener el token de las cookies primero
  const token = req.cookies.authToken || req.headers['authorization']?.split(' ')[1];

  if (!token) {
    return res.sendStatus(401); // Unauthorized
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.sendStatus(403); // Forbidden
    }
    req.user = user;
    next();
  });
};

// Middleware para validar el token y el rol
const authenticateTokenAndAuthorize = (roles) => (req, res, next) => {
  authenticateToken(req, res, () => {
    if (roles.includes(req.user.rol)) {
      next();
    } else {
      res.status(403).json({ message: 'No tiene permiso para realizar esta acción' });
    }
  });
};

module.exports = {
  authenticateToken,
  authenticateTokenAndAuthorize
};
