const express = require('express');
const Customer = require('../models/customer');

const router = express.Router();

router.get('/', (req, res, next) => {
    Customer.findAll((err, customers) => {
        if (err) return next(err);
        res.json(customers);
    });
});

router.get('/id/:id', (req, res, next) => {
    Customer.findById(req.params.id, (err, customer) => {
        if (err) return next(err);
        if (!customer) {
            return res.sendStatus(404);
        }
        res.json(customer);
    });
});

router.get('/email/:id', (req, res, next) => {
    Customer.findByEmail(req.params.id, (err, customer) => {
        if (err) return next(err);
        if (!customer) {
            return res.sendStatus(404);
        }
        res.json(customer);
    });
});

router.post('/', (req, res, next) => {
    const customer = new Customer(null, req.body.firstName, req.body.lastName, req.body.email, req.body.street, req.body.city, req.body.state, req.body.zip);
    customer.add((err, newCustomer) => {
        if (err) return next(err);
        res.status(201).json(newCustomer);
    });
});

router.put('/:id', (req, res, next) => {
    Customer.findById(req.params.id, (err, customer) => {
        if (err) return next(err);
        if (!customer) {
            return res.sendStatus(404);
        }
        customer.firstName = req.body.firstName;
        customer.lastName = req.body.lastName;
        customer.email = req.body.email;
        customer.street = req.body.street;
        customer.city = req.body.city;
        customer.state = req.body.state;
        customer.zip = req.body.zip
        customer.update((err, updatedCustomer) => {
            if (err) return next(err);
            res.json(updatedCustomer);
        });
    });
});

router.delete('/:id', (req, res, next) => {
    Customer.findById(req.params.id, (err, customer) => {
        if (err) return next(err);
        if (!customer) {
            return res.sendStatus(404);
        }
        customer.delete((err) => {
            if (err) return next(err);
            res.sendStatus(200);
        });
    });
});

module.exports = router;
