const express = require("express");
const mysql = require("mysql2");
const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv = require("dotenv");
const app = express();
dotenv.config();

const PORT = process.env.PORT || 8070;

app.use(cors());
app.use(bodyParser.json());
app.use(express.json());

  
const connectionPool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DATABASE,
    connectionLimit: process.env.DB_CONNECTION_LIMIT
});

connectionPool.query('SHOW TABLES', (err, res)=>{
    if(err) return console.log(err);
    return console.log(res);
});


const customerRouter = require('./routes/customers.js');
app.use("/customer", customerRouter);

const productRouter = require('./routes/products.js');
app.use("/product", productRouter);

const orderRouter = require('./routes/orders.js');
app.use("/order", orderRouter);

app.listen(PORT, (req, res)=>{
    console.log('server is running on PORT = ', PORT);
});