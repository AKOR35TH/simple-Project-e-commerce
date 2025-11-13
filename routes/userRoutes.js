// routes/userRoutes.js

const express = require('express');
const router = express.Router(); 
// Importa a instância única da base de dados (MODELO)
const db = require('../model/db'); 

// ------------------------------------
// --- USERS (CRUD) ---
// ------------------------------------

// GET / (equivale a /api/users): Lists all users
router.get('/', (req, res) => {
    db.all("SELECT * FROM users", [], (err, rows) => {
        if (err) return res.status(500).json({ error: 'Database reading failed.' });
        res.json(rows);
    });
});

// GET /:id (equivale a /api/users/:id): Gets a specific user
router.get('/:id', (req, res) => {
    const userId = parseInt(req.params.id);
    db.get("SELECT * FROM users WHERE id = ?", [userId], (err, row) => {
        if (err) return res.status(500).json({ error: 'Database reading failed.' });
        if (row) {
            res.json(row);
        } else {
            res.status(404).json({ error: `User with ID ${userId} not found.` });
        }
    });
});

// POST / (equivale a /api/users): Creates a new user
router.post('/', (req, res) => {
    const { name, email } = req.body;
    
    if (!name || !email) {
        return res.status(400).json({ error: 'Missing required fields: name and email.' });
    }

    const sql = `INSERT INTO users (name, email) VALUES (?, ?)`;
    const params = [name, email];

    db.run(sql, params, function(err) {
        if (err) {
            if (err.message.includes('UNIQUE constraint failed')) {
                return res.status(409).json({ error: 'User with this email already exists.' });
            }
            return res.status(500).json({ error: 'Database insertion failed.' });
        }
        
        const newUser = { id: this.lastID, name, email };
        res.status(201).json(newUser);
    });
});

// PUT /:id (equivale a /api/users/:id): Updates an existing user
router.put('/:id', (req, res) => {
    const userId = parseInt(req.params.id);
    const { name, email } = req.body;
    
    if (!name || !email) return res.status(400).json({ error: 'Missing required fields: name and email.' });

    const sql = `UPDATE users SET name = ?, email = ? WHERE id = ?`;
    const params = [name, email, userId];

    db.run(sql, params, function(err) {
        if (err) {
            if (err.message.includes('UNIQUE constraint failed')) {
                return res.status(409).json({ error: 'A different user already has this email.' });
            }
            return res.status(500).json({ error: 'Database update failed.' });
        }
        
        if (this.changes > 0) {
            const updatedUser = { id: userId, name, email };
            res.json(updatedUser);
        } else {
            res.status(404).json({ error: `User with ID ${userId} not found.` });
        }
    });
});

// DELETE /:id (equivale a /api/users/:id): Deletes a user
router.delete('/:id', (req, res) => {
    const userId = parseInt(req.params.id);
    
    db.run("DELETE FROM users WHERE id = ?", [userId], function(err) {
        if (err) return res.status(500).json({ error: 'Database deletion failed.' });
        
        if (this.changes > 0) {
            res.status(204).send(); 
        } else {
            res.status(404).json({ error: `User with ID ${userId} not found.` });
        }
    });
});

module.exports = router;