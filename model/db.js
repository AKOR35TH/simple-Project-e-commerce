// model/db.js

const sqlite3 = require('sqlite3').verbose(); 
const path = require('path');

// Location of the database file (store.db in the project root)
const DB_FILE = path.join(__dirname, '..', 'store.db');

// Creates or opens the database
const db = new sqlite3.Database(DB_FILE, (err) => {
    if (err) {
        console.error('Error connecting to SQLite database:', err.message); 
    } else {
        console.log('Connected to SQLite database (store.db) from the Model.'); 
        // Ensures tables are created
        initializeDB(db);
    }
});

// Function to create tables (updated to include imageUrl in products)
function initializeDB(database) {
    database.serialize(() => {
        database.run(`CREATE TABLE IF NOT EXISTS products (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            price REAL NOT NULL,
            stock INTEGER DEFAULT 0,
            imageUrl TEXT DEFAULT ''  /* 🟢 NEW FIELD */
        )`);
        database.run(`CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL
        )`);
        database.run(`CREATE TABLE IF NOT EXISTS orders (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            userId INTEGER NOT NULL,
            items TEXT NOT NULL, 
            orderDate TEXT
        )`);
    });
}

// Exports the single DB connection instance
module.exports = db;