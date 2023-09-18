const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DATABASE
});

class Customer {
    constructor(id, firstName, lastName, email, street, city, state, zip) {
        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.street = street;
        this.city = city;
        this.state = state;
        this.zip = zip;
    }

    static findAll(callback) {
        connection.query('SELECT * FROM customers', (err, rows) => {
            if (err) return callback(err);
            console.log(rows);
            callback(null, rows);
        });
    }

    static findById(id, callback) {
        connection.query('SELECT * FROM customers WHERE id = ?', [id], (err, rows) => {
            if (err) return callback(err);
            if (rows.length) {
                const row = rows[0];
                callback(null, rows);
            } else {
                callback(null, null);
            }
        });
    }

    static findByEmail(email, callback) {
        connection.query('SELECT * FROM customers WHERE email = ?', [email], (err, rows) => {
            if (err) return callback(err);
            if (rows.length) {
                const row = rows[0];
                callback(null, rows);
            } else {
                callback(null, null);
            }
        });
    }

    add(callback) {
        connection.query('INSERT INTO customers (firstName, lastName, email, street, city, state, zip) VALUES (?, ?, ?, ?, ?, ?, ?)', 
        [this.firstName, this.lastName, this.email, this.street, this.city, this.state, this.zip], (err, result) => {
            if (err) return callback(err);
            this.id = result.insertId;
            callback(null, this);
        });
    }

    update(callback) {
        connection.query('UPDATE customers SET firstName = ?, lastName = ?, email = ?, street = ?, city = ?, state = ?, zip = ? WHERE id = ?', 
        [this.firstName, this.lastName, this.email, this.street, this.city, this.state, this.zip], (err, result) => {
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

module.exports = Customer;
