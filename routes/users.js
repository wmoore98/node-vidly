const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const usersStore = require('../store/users');
const { validate } = require('../models/user');

router.get('/', auth, async (req, res) => {
    const users = await usersStore.getUsers();
    res.send(users);
});

router.post('/', async (req, res) => {
    const { error, value } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const { token, user } = await usersStore.createUser(value);
    res.header('x-auth-token', token).send(user);
});

router.get('/me', auth, async (req, res) => {
    const user = await usersStore.getUser(req.user._id); // req.user._id is added by auth middleware
    if (!user) return res.status(404).send(`Oops - cannot find user with ID = ${req.user._id}.`); // could happen since auth uses token, not db
    res.send(user);
});

router.get('/:id', [auth, admin], async (req, res) => {
    const user = await usersStore.getUser(req.params.id);
    if (!user) return res.status(404).send(`Oops - cannot find user with ID = ${req.params.id}.`);
    res.send(user);
});

// NOT a good implementation - only admins can update users
// LOTS of consideration would be necessary to define authorizations
router.put('/:id', [auth, admin], async (req, res) => {
    const { error, value } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const user = await usersStore.updateUser(req.params.id, value);
    if (!user) return res.status(404).send(`Oops - cannot find user with ID = ${req.params.id}.`);
    res.send(user);
});

router.delete('/:id', auth, async (req, res) => {
    const user = await usersStore.deleteUser(req.params.id);
    if (!user) return res.status(404).send(`Oops - cannot find user with ID = ${req.params.id}.`);
    res.send(user);
});

module.exports = router;
