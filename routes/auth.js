const express = require('express');
const router = express.Router();

const authStore = require('../store/auth');
const { validate } = require('../models/auth');

router.post('/', async (req, res) => {
    const { error, value } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const auth = await authStore.createAuth(value);
    res.send(auth);
});

module.exports = router;
