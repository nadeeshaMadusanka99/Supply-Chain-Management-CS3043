const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DATABASE
});

class Order {
    constructor(id, customerid, productid, date, quantity, routeid, trackingNo) {
        this.id = id;
        this.customerid = customerid;
        this.productid = productid;
        this.date = date;
        this.quantity = quantity;
        this.routeid = routeid;
        this.trackingNo = trackingNo;
    }

    static findAll(callback) {
        connection.query('SELECT * FROM orders', (err, rows) => {
            if (err) return callback(err);
            callback(null, rows);
        });
    }

    // READ
    static findById(id, callback) {
        connection.query('SELECT * FROM orders WHERE orderID = ?', [id], (err, rows) => {
            if (err) return callback(err);
            if (rows.length) {
                const row = rows[0];
                const order =  new Order(row.id, row.customerid, row.productid, row.date, row.quantity, row.routeid, row.trackingNo);
                callback(rows);
            } else {
                callback(null, null);
            }
        });
    }

    static findByCustomerId(id, callback) {
        connection.query('SELECT * FROM orders WHERE customerID = ?', [id], (err, rows) => {
            if (err) return callback(err);
            if (rows.length) {
                const row = rows[0];
                callback(null, new Order(row.id, row.customerid, row.productid, row.date, row.quantity, row.routeid, row.trackingNo));
            } else {
                callback(null, null);
            }
        });
    }

    static findByProductID(id, callback) {
        connection.query('SELECT * FROM orders WHERE productID = ?', [id], (err, rows) => {
            if (err) return callback(err);
            if (rows.length) {
                const row = rows[0];
                callback(null, new Order(row.id, row.customerid, row.productid, row.date, row.quantity, row.routeid, row.trackingNo));
            } else {
                callback(null, null);
            }
        });
    }
/*
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
*/
    delete(callback) {
        connection.query('DELETE FROM orders WHERE id = ?', [this.id], (err, result) => {
            if (err) return callback(err);
            callback(null, this);
        });
    }
}

module.exports = Order;