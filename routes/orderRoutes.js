// routes/orderRoutes.js

const express = require('express');
const router = express.Router(); 
// Importa a instância única da base de dados (MODELO)
const db = require('../model/db'); 

// ------------------------------------
// --- ORDERS (GET/POST) ---
// ------------------------------------

// GET / (equivale a /api/orders): Lists all orders
router.get('/', (req, res) => {
    db.all("SELECT * FROM orders", [], (err, rows) => {
        if (err) return res.status(500).json({ error: 'Database reading failed.' });
        
        // Converte a string JSON de 'items' de volta para um array/objeto
        const orders = rows.map(row => ({
            ...row,
            items: JSON.parse(row.items) 
        }));
        res.json(orders);
    });
});

// POST / (equivale a /api/orders): Creates a new order
router.post('/', (req, res) => {
    const { userId, items } = req.body;
    
    if (!userId || !items) return res.status(400).json({ error: 'Missing required fields: userId and items.' });

    // items deve ser convertido para string JSON para ser guardado
    const itemsJson = JSON.stringify(items);
    const orderDate = new Date().toISOString();

    const sql = `INSERT INTO orders (userId, items, orderDate) VALUES (?, ?, ?)`;
    const params = [userId, itemsJson, orderDate];

    db.run(sql, params, function(err) {
        if (err) return res.status(500).json({ error: 'Database insertion failed.' });
        
        const newOrder = { id: this.lastID, userId, items, orderDate };
        res.status(201).json(newOrder);
    });
});

module.exports = router;