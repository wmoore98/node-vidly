const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const validateObjectId = require('../middleware/validateObjectId');
const genresStore = require('../store/genres');
const { validate } = require('../models/genre');


router.get('/', async (req, res) => {
    const genres = await genresStore.getGenres();
    res.send(genres);
});

router.post('/', auth, async (req, res) => {
    const { error, value } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const genre = await genresStore.createGenre(value);
    res.send(genre);
});

router.get('/:id', validateObjectId, async (req, res) => {
    const genre = await genresStore.getGenre(req.params.id);
    if (!genre) return res.status(404).send(`Oops - cannot find genre with ID = ${req.params.id}.`);
    res.send(genre);
});

router.put('/:id', validateObjectId, auth, async (req, res) => {
    const { error, value } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const genre = await genresStore.updateGenre(req.params.id, value);
    if (!genre) return res.status(404).send(`Oops - cannot find genre with ID = ${req.params.id}.`);
    res.send(genre);
});

router.delete('/:id', validateObjectId, [auth, admin], async (req, res) => {
    const genre = await genresStore.deleteGenre(req.params.id);
    if (!genre) return res.status(404).send(`Oops - cannot find genre with ID = ${req.params.id}.`);
    res.send(genre);
});

module.exports = router;
