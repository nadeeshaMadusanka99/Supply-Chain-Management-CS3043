const express = require('express');
const Product = require('../models/product');

const router = express.Router();

router.get('/', (req, res, next) => {
    Product.findAll((err, products) => {
        if (err) return next(err);
        res.json(products);
    });
});

router.get('/id/:id', (req, res, next) => {
    Product.findById(req.params.id, (err, Product) => {
        if (err) return next(err);
        if (!Product) {
            return res.sendStatus(404);
        }
        res.json(Product);
    });
});

router.get('/title/:id', (req, res, next) => {
    Product.findByTItle(req.params.id, (err, Product) => {
        if (err) return next(err);
        if (!Product) {
            return res.sendStatus(404);
        }
        res.json(Product);
    });
});

router.post('/', (req, res, next) => {
    const product = new Product(null, req.body.firstName, req.body.lastName, req.body.email, req.body.street, req.body.city, req.body.state, req.body.zip);
    product.add((err, newProduct) => {
        if (err) return next(err);
        res.status(201).json(newProduct);
    });
});

router.put('/:id', (req, res, next) => {
    Product.findById(req.params.id, (err, Product) => {
        if (err) return next(err);
        if (!Product) {
            return res.sendStatus(404);
        }
        Product.firstName = req.body.firstName;
        Product.lastName = req.body.lastName;
        Product.email = req.body.email;
        Product.street = req.body.street;
        Product.city = req.body.city;
        Product.state = req.body.state;
        Product.zip = req.body.zip
        Product.update((err, updatedProduct) => {
            if (err) return next(err);
            res.json(updatedProduct);
        });
    });
});

router.delete('/:id', (req, res, next) => {
    Product.findById(req.params.id, (err, Product) => {
        if (err) return next(err);
        if (!Product) {
            return res.sendStatus(404);
        }
        Product.delete((err) => {
            if (err) return next(err);
            res.sendStatus(200);
        });
    });
});

module.exports = router;
