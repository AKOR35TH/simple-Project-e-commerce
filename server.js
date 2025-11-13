// server.js

const express = require('express');
const path = require('path');

// Garante que a conexão DB é inicializada e as tabelas são criadas (Modelo)
require('./model/db'); 

// Importa todos os módulos de rotas (Controladores)
const productRoutes = require('./routes/productRoutes'); 
const userRoutes = require('./routes/userRoutes'); 
const orderRoutes = require('./routes/orderRoutes'); 
const webRoutes = require('./routes/webRoutes'); 

const app = express();
const PORT = 3000;

// ------------------------------------
// EXPRESS/MIDDLEWARE CONFIGURATION
// ------------------------------------
app.set('view engine', 'ejs'); 
app.set('views', './views'); 
app.use(express.static('views/public')); 
app.use(express.json()); 

// ------------------------------------
// ROTAS MODULARIZADAS (API e WEB)
// ------------------------------------
// Rotas da API (com prefixo /api)
app.use('/api/products', productRoutes); 
app.use('/api/users', userRoutes); 
app.use('/api/orders', orderRoutes); 

// Rotas da Web (sem prefixo, para ser a raiz do website)
app.use('/', webRoutes); 

// ------------------------------------
// ROTA DE RAIZ DA API (Documentação)
// ------------------------------------
app.get('/api', (req, res) => {
    res.json({
        message: 'Welcome to the Simple Store REST API!',
        endpoints_modularizados: ['/api/products', '/api/users', '/api/orders'],
        status: 'API 100% modularizada e a usar SQLite.'
    });
});


// ------------------------------------
// START SERVER
// ------------------------------------
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});