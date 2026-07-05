const express = require('express');
const router = express.Router();
const { signup, login } = require('../controllers/authController');

// Definir las rutas y enlazarlas con las funciones del controlador
router.post('/signup', signup);
router.post('/login', login);

module.exports = router;