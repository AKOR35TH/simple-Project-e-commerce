// routes/webRoutes.js

const express = require('express');
const router = express.Router(); 
// Import the single database instance (MODEL)
const db = require('../model/db'); 

// ------------------------------------
// PUBLIC WEBSITE ROUTES (HTML/EJS)
// ------------------------------------

// GET / (Home Page)
router.get('/', (req, res) => {
    res.send('<h1>Welcome to the Simple Store!</h1><p>Check out our <a href="/products">products</a>.</p>');
});

// GET /products: Product list (SQLite)
router.get('/products', (req, res) => {
    db.all("SELECT * FROM products", [], (err, products) => {
        if (err) {
            // The 'products' view must be created in the 'views/' folder
            return res.render('products', { products: [], error: 'Failed to load products from database.' });
        }
        res.render('products', { products: products }); 
    });
});

// GET /product/:id: Product details (SQLite)
router.get('/product/:id', (req, res) => {
    const productId = parseInt(req.params.id);
    
    db.get("SELECT * FROM products WHERE id = ?", [productId], (err, product) => {
        if (err) return res.status(500).send('<h1>500</h1><p>Database Error.</p>');

        if (product) {
            // 🟢 CORREÇÃO: Usamos o operador OR (||) para garantir que a imagem não é uma string vazia se for nula.
            const imageUrl = product.imageUrl || '/images/placeholder.jpg';
            
            res.send(`
                <h1>Product Details: ${product.name}</h1>
                <p><img src="${imageUrl}" alt="${product.name}" style="max-width: 300px; height: auto; border-radius: 8px;"></p>
                <p><strong>ID:</strong> ${product.id}</p>
                <p><strong>Price:</strong> ${product.price}€</p>
                <p><strong>Stock:</strong> ${product.stock}</p>
                <p>For API access: <code>/api/products/${product.id}</code></p>
                <p><a href="/products">← Back to Catalog</a></p>
            `);
        } else {
            res.status(404).send('<h1>404</h1><p>Product not found.</p>');
        }
    });
});

module.exports = router;