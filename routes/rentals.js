const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');
const rentalsStore = require('../store/rentals');
const { validate } = require('../models/rental');

router.get('/', async (req, res) => {
    const rentals = await rentalsStore.getRentals();
    res.send(rentals);
});

router.post('/', auth, async (req, res) => {
    const { error, value } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const rental = await rentalsStore.createRental(value);
    res.send(rental);
});

router.get('/:id', async (req, res) => {
    const rental = await rentalsStore.getRental(req.params.id);
    if (!rental) return res.status(404).send(`Oops - cannot find rental with ID = ${req.params.id}.`);
    res.send(rental);

});

router.put('/:id', auth, async (req, res) => {
    const { error, value } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const rental = await rentalsStore.updateRental(req.params.id, value);
    if (!rental) return res.status(404).send(`Oops - cannot find rental with ID = ${req.params.id}.`);
    res.send(rental);
});

router.delete('/:id', auth, async (req, res) => {
    const rental = await rentalsStore.deleteRental(req.params.id);
    if (!rental) return res.status(404).send(`Oops - cannot find rental with ID = ${req.params.id}.`);
    res.send(rental);
});

module.exports = router;
