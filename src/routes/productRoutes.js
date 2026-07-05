const express = require('express');
const router = express.Router();
const pool = require('../config/database');
const { verifyToken, authorizeRole } = require('../middlewares/authJWT');

// GET /products - Público
router.get('/products', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM products');
        res.json(result.rows);
    } catch (error) {
        console.error("Error en GET /products:", error);
        res.status(500).json({ error: "Error interno del servidor al obtener productos." });
    }
});

// GET /products/:id - Público
router.get('/products/:id', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM products WHERE id = $1', [req.params.id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Producto no encontrado." });
        }
        res.json(result.rows[0]);
    } catch (error) {
        console.error("Error en GET /products/:id:", error);
        res.status(500).json({ error: "Error interno del servidor al buscar el producto." });
    }
});

// POST /products - Protegido (Solo Admin)
router.post('/products', verifyToken, authorizeRole('admin'), async (req, res) => {
    const { name, price } = req.body;
    
    if (!name || typeof price !== 'number' || price <= 0) {
        return res.status(400).json({ error: "Datos inválidos. El precio debe ser un número mayor a 0." });
    }

    try {
        const result = await pool.query('INSERT INTO products (name, price) VALUES ($1, $2) RETURNING *', [name, price]);
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error("Error en POST /products:", error);
        res.status(500).json({ error: "Error interno del servidor al crear el producto." });
    }
});

// PUT /products/:id - Protegido (Solo Admin)
router.put('/products/:id', verifyToken, authorizeRole('admin'), async (req, res) => {
    const { name, price } = req.body;
    
    if (!name || typeof price !== 'number' || price <= 0) {
        return res.status(400).json({ error: "Datos inválidos. El precio debe ser un número mayor a 0." });
    }

    try {
        const result = await pool.query(
            'UPDATE products SET name=$1, price=$2, updated_at=CURRENT_TIMESTAMP WHERE id=$3 RETURNING *', 
            [name, price, req.params.id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Producto no encontrado." });
        }
        res.json(result.rows[0]);
    } catch (error) {
        console.error("Error en PUT /products/:id:", error);
        res.status(500).json({ error: "Error interno del servidor al actualizar el producto." });
    }
});

// DELETE /products/:id - Protegido (Solo Admin)
router.delete('/products/:id', verifyToken, authorizeRole('admin'), async (req, res) => {
    try {
        const result = await pool.query('DELETE FROM products WHERE id = $1 RETURNING *', [req.params.id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Producto no encontrado." });
        }
        res.json({ message: "Producto eliminado correctamente." });
    } catch (error) {
        console.error("Error en DELETE /products/:id:", error);
        res.status(500).json({ error: "Error interno del servidor al eliminar el producto." });
    }
});

module.exports = router;
