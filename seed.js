// seed.js

const db = require('./model/db'); // Imports the single DB connection
const readline = require('readline'); // Native module for console interaction

// 🟢 UPDATED PRODUCTS DATA with the latest image URLs
const PRODUCTS_DATA = [
    { name: 'Ring Aurora', price: 950.00, stock: 45, 
        imageUrl: 'https://i.pinimg.com/1200x/77/72/54/777254825c59ff7605544bf8d02ecd1f.jpg' },
    { name: 'Midnight Necklace', price: 780.00, stock: 120, 
        imageUrl: 'https://i.pinimg.com/736x/52/11/8d/52118dcf0c05240ad084e840a0a54929.jpg' },
    { name: 'Venus Bracelet', price: 1100.00, stock: 78, 
        imageUrl: 'https://i.pinimg.com/1200x/d1/bc/67/d1bc6788aa0383fc06c2be10bbd8ecdb.jpg' },
    { name: 'Stellar Earrings', price: 590.00, stock: 200, 
        imageUrl: 'https://i.pinimg.com/736x/30/be/ad/30beadff274cecc95c985121d16e504c.jpg' },
    { name: 'Scorpio Ring', price: 1350.00, stock: 15,
        imageUrl: 'https://i.pinimg.com/1200x/1b/8a/6a/1b8a6acd82050ec4b4d8c1ea228ea9f4.jpg' }
];

const USERS_DATA = [
    { name: 'John Smith', email: 'john.smith@example.com' },
    { name: 'Mary White', email: 'mary.white@example.com' }
];

function runSeed() {
    db.serialize(() => {
        // --- 1. Insert Products (Updated to include imageUrl) ---
        // NOTE: The table structure MUST include the 'imageUrl' column for this to work.
        const stmtProducts = db.prepare("INSERT INTO products (name, price, stock, imageUrl) VALUES (?, ?, ?, ?)");
        PRODUCTS_DATA.forEach(p => {
            stmtProducts.run(p.name, p.price, p.stock, p.imageUrl);
        });
        stmtProducts.finalize();
        console.log(`✅ ${PRODUCTS_DATA.length} Products inserted.`);

        // --- 2. Insert Users ---
        const stmtUsers = db.prepare("INSERT INTO users (name, email) VALUES (?, ?)");
        USERS_DATA.forEach(u => {
            stmtUsers.run(u.name, u.email);
        });
        stmtUsers.finalize();
        console.log(`✅ ${USERS_DATA.length} Users inserted.`);
        
        // --- 3. Insert a Sample Order ---
        const userId = 1;
        const items = [
            { product_id: 1, name: PRODUCTS_DATA[0].name, quantity: 1 },
            { product_id: 3, name: PRODUCTS_DATA[2].name, quantity: 2 }
        ];
        const itemsJson = JSON.stringify(items);
        const orderDate = new Date().toISOString();

        db.run("INSERT INTO orders (userId, items, orderDate) VALUES (?, ?, ?)", [userId, itemsJson, orderDate], function(err) {
            if (err) {
                console.error("❌ Error inserting order:", err.message);
            } else {
                console.log(`✅ Sample Order inserted (ID: ${this.lastID}).`);
            }
        });

        console.log("\nInitial data successfully inserted into 'store.db'.");
        db.close();
    });
}

// Asks the user before clearing and inserting data
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.question('⚠️ WARNING: Do you want to CLEAR all existing data (products, users, orders) and insert test data? (y/N): ', (answer) => {
    if (answer.toLowerCase() === 'y') {
        db.serialize(() => {
            console.log("Clearing existing data...");
            // Use DELETE FROM to clear the tables in SQLite
            db.run("DELETE FROM orders");
            db.run("DELETE FROM products");
            db.run("DELETE FROM users");
            console.log("Data cleared. Inserting new data...");
            runSeed();
        });
    } else {
        console.log("Operation cancelled. Database remains unchanged.");
    }
    rl.close();
});