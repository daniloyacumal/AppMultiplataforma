const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../config/database'); // Tu archivo de conexión

// Registro
async function signup(req, res) {
    const { username, email, password, role } = req.body;
    const passwordHash = await bcrypt.hash(password, 10);
    try {
        await pool.query(
            'INSERT INTO users (username, email, password_hash, role) VALUES ($1, $2, $3, $4)',
            [username, email, passwordHash, role || 'cliente']
        );
        res.status(201).json({ message: "Usuario registrado con éxito" });
    } catch (err) {
        console.error(err);
        res.status(400).json({ error: "El usuario o email ya existen" });
    }
}

// Login
async function login(req, res) {
    const { email, password } = req.body;
    try {
        const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (result.rows.length === 0) return res.status(401).json({ error: "Credenciales incorrectas" });

        const user = result.rows[0];
        const validPassword = await bcrypt.compare(password, user.password_hash);
        if (!validPassword) return res.status(401).json({ error: "Credenciales incorrectas" });

        // Firmar Token incluyendo el Rol
        const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '2h' });
        res.json({ token });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Error interno del servidor" });
    }
}

module.exports = { signup, login };
