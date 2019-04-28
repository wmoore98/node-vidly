const express = require('express');
const router = express.Router();
const Joi = require('joi');

const auth = require('../middleware/auth');
const validate = require('../middleware/validate');
const rentalsStore = require('../store/rentals');

router.post('/', [auth, validate(validateReturn)], async (req, res) => {
    const rental = await rentalsStore.updateRental(req.body);
    res.send(rental);
});

function validateReturn(data) {
    const schema = {
        customerId: Joi.objectId().required(),
        movieId: Joi.objectId().required()
    };

    return Joi.validate(data, schema);
}

module.exports = router;
