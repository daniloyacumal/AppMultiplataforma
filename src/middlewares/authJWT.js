// Importar la librería jwt necesaria para verificar el token
const jwt = require('jsonwebtoken');

// Middleware de verificación de Token (authJWT)
function verifyToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    if (!authHeader) return res.status(401).json({ error: "Acceso denegado. Token faltante." });

    const token = authHeader.split(' ')[1]; // Extrae el token tras el prefijo 'Bearer'
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Adjunta los datos decodificados al request
        next();
    } catch (error) {
        res.status(403).json({ error: "Token inválido o expirado." });
    }
}

// Middleware de Autorización por Rol
function authorizeRole(role) {
    return (req, res, next) => {
        if (!req.user || req.user.role !== role) {
            return res.status(403).json({ error: "Acceso denegado. Permisos insuficientes." });
        }
        next();
    };
}

module.exports = { verifyToken, authorizeRole };
