// routes/productRoutes.js

const express = require('express');
const router = express.Router(); 
// Importa a instância única da base de dados (MODELO)
const db = require('../model/db'); 

// ------------------------------------
// --- PRODUCTS (CRUD) ---
// ------------------------------------

// GET / (equivale a /api/products): Lists all products
router.get('/', (req, res) => {
    db.all("SELECT * FROM products", [], (err, rows) => {
        if (err) return res.status(500).json({ error: 'Database reading failed.' });
        res.json(rows);
    });
});

// GET /:id (equivale a /api/products/:id): Gets a specific product
router.get('/:id', (req, res) => {
    const productId = parseInt(req.params.id);
    db.get("SELECT * FROM products WHERE id = ?", [productId], (err, row) => {
        if (err) return res.status(500).json({ error: 'Database reading failed.' });
        
        if (row) {
            res.json(row);
        } else {
            res.status(404).json({ error: `Product with ID ${productId} not found.` });
        }
    });
});

// POST / (equivale a /api/products): Creates a new product
router.post('/', (req, res) => {
    const { name, price, stock } = req.body;
    if (!name || !price) return res.status(400).json({ error: 'Missing required fields: name and price.' });

    const sql = `INSERT INTO products (name, price, stock) VALUES (?, ?, ?)`;
    const params = [name, price, stock || 0];

    db.run(sql, params, function(err) {
        if (err) return res.status(500).json({ error: 'Database insertion failed.' });
        
        const newProduct = { id: this.lastID, name, price, stock: stock || 0 };
        res.status(201).json(newProduct);
    });
});

// PUT /:id (equivale a /api/products/:id): Updates an existing product
router.put('/:id', (req, res) => {
    const productId = parseInt(req.params.id);
    const { name, price, stock } = req.body;
    
    if (!name || !price) return res.status(400).json({ error: 'Missing required fields: name and price.' });

    const sql = `UPDATE products SET name = ?, price = ?, stock = ? WHERE id = ?`;
    const params = [name, price, stock || 0, productId];

    db.run(sql, params, function(err) {
        if (err) return res.status(500).json({ error: 'Database update failed.' });
        
        if (this.changes > 0) {
            const updatedProduct = { id: productId, name, price, stock: stock || 0 };
            res.json(updatedProduct);
        } else {
            res.status(404).json({ error: `Product with ID ${productId} not found.` });
        }
    });
});

// DELETE /:id (equivale a /api/products/:id): Deletes a product
router.delete('/:id', (req, res) => {
    const productId = parseInt(req.params.id);

    db.run("DELETE FROM products WHERE id = ?", [productId], function(err) {
        if (err) return res.status(500).json({ error: 'Database deletion failed.' });
        
        if (this.changes > 0) {
            res.status(204).send(); 
        } else {
            res.status(404).json({ error: `Product with ID ${productId} not found.` });
        }
    });
});

module.exports = router;