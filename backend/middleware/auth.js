const jwt = require('jsonwebtoken');
const { JWT_SECRET } = process.env;  // Asegúrate de tener una clave secreta

const authenticateToken = (req, res, next) => {
    const token = req.cookies.authToken; // Recupera el token de la cookie
    if (!token) return res.status(401).json({ error: 'No autorizado' });

    jwt.verify(JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ error: 'Token inválido o expirado' });
        req.user = user;
        next();
    });
};

const authorizeRoles = (...roles) => (req, res, next) => {
    const { role } = req.user;
    if (!roles.includes(role)) {
        return res.status(403).json({ error: 'No tienes permiso para acceder a este recurso' });
    }
    next();
};

module.exports = {authenticateToken, authorizeRoles};