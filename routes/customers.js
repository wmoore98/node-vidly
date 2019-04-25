const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');
const customersStore = require('../store/customers');
const { validate } = require('../models/customer');

router.get('/', async (req, res) => {
    const customers = await customersStore.getCustomers();
    res.send(customers);
});

router.post('/', auth, async (req, res) => {
    const { error, value } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const customer = await customersStore.createCustomer(value);
    res.send(customer);
});

router.get('/:id', async (req, res) => {
    const customer = await customersStore.getCustomer(req.params.id);
    if (!customer) return res.status(404).send(`Oops - cannot find customer with ID = ${req.params.id}.`);
    res.send(customer);
});

router.put('/:id', auth, async (req, res) => {
    const { error, value } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const customer = await customersStore.updateCustomer(req.params.id, value);
    if (!customer) return res.status(404).send(`Oops - cannot find customer with ID = ${req.params.id}.`);
    res.send(customer);
});

router.delete('/:id', auth, async (req, res) => {
    const customer = await customersStore.deleteCustomer(req.params.id);
    if (!customer) return res.status(404).send(`Oops - cannot find customer with ID = ${req.params.id}.`);
    res.send(customer);
});

module.exports = router;
