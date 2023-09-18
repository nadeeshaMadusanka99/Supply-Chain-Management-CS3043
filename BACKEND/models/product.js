const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DATABASE
});

class Product {
    constructor(id, title, imagePath, details, capacityConsumption, price, discount) {
        this.id = id;
        this.title = title;
        this.imagePath = imagePath;
        this.details = details;
        this.capacityConsumption = capacityConsumption;
        this.price = price;
        this.discount = discount;
    }

    static findAll(callback) {
        connection.query('SELECT * FROM products', (err, rows) => {
            if (err) return callback(err);
            console.log(rows);
            //console.log(rows.map(row => new Product(row.id, row.title, row.imagePath, row.details, row.capacityConsumption, row.price, row.discount)));
            callback(null, rows);
        });
    }

    // READ
    static findById(id, callback) {
        connection.query('SELECT * FROM products WHERE id = ?', [id], (err, rows) => {
            if (err) return callback(err);
            if (rows.length) {
                const row = rows[0];
                callback(null, rows);
            } else {
                callback(null, null);
            }
        });
    }

    static findByTItle(title, callback) {
        const query = `SELECT * FROM products WHERE title = ?`;
        connection.query(query, [title], (error, results) => {
            if (error) throw error;
            callback(results);
        });
    }

    add(callback) {
        const query = `INSERT INTO products (title, imagePath, details, capacityConsumption, price, discount) VALUES (?, ?, ?, ?, ?, ?)`;
        const values = [this.title, this.imagePath, this.details,this.capacityConsumption, this.price, this.discount];

        connection.query(query, values, (error, results) => {
            if (error) return callback(error);
            this.id = results.insertId;
            callback(null, this);
        });
    }

    update(callback) {
        connection.query('UPDATE products SET title = ?, imagePath = ?, details = ?, capacityConsumption = ?, price = ?, discount = ? WHERE id = ?', 
        [this.title, this.imagePath, this.details, this.capacityConsumption, this.price, this.discount], (err, result) => {
            if (err) return callback(err);
            callback(null, this);
        });
    }

    delete(callback) {
        connection.query('DELETE FROM customers WHERE id = ?', [this.id], (err, result) => {
            if (err) return callback(err);
            callback(null, this);
        });
    }
}

module.exports = Product;