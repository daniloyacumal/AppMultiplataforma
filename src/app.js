require('dotenv').config();
const express = require('express');
const productRoutes = require('./routes/productRoutes');
const authRoutes = require('./routes/authRoutes');

const app = express();

// Middleware global para procesar cuerpos en formato JSON
app.use(express.json());

// Registro básico de peticiones en consola (Útil para desarrollo)
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

// Montar las rutas de productos bajo el prefijo /api
app.use('/auth', authRoutes);
app.use('/api', productRoutes);

// Manejo global de rutas no encontradas (404)
app.use((req, res) => {
    res.status(404).json({ error: "Ruta no encontrada" });
});

// Control de errores global del servidor
app.use((err, req, res, next) => {
    console.error("Error no manejado en la aplicación:", err.stack);
    res.status(500).json({ error: "Ocurrió un error interno en el servidor" });
});

// Definición del puerto y arranque del servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Servidor API de EcoHome corriendo exitosamente.`);
    console.log(`🌍 URL local disponible en: http://localhost:${PORT}`);
});

module.exports = app;
