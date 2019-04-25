const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');
const moviesStore = require('../store/movies');
const { validate } = require('../models/movie');

router.get('/', async (req, res) => {
    const movies = await moviesStore.getMovies();
    res.send(movies);
});

router.post('/', auth, async (req, res) => {
    const { error, value } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const movie = await moviesStore.createMovie(value);
    res.send(movie);
});

router.get('/:id', async (req, res) => {
    const movie = await moviesStore.getMovie(req.params.id);
    if (!movie) return res.status(404).send(`Oops - cannot find movie with ID = ${req.params.id}.`);
    res.send(movie);
});

router.put('/:id', auth, async (req, res) => {
    const { error, value } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const movie = await moviesStore.updateMovie(req.params.id, value);
    if (!movie) return res.status(404).send(`Oops - cannot find movie with ID = ${req.params.id}.`);
    res.send(movie);
});

router.delete('/:id', auth, async (req, res) => {
    const movie = await moviesStore.deleteMovie(req.params.id);
    if (!movie) return res.status(404).send(`Oops - cannot find movie with ID = ${req.params.id}.`);
    res.send(movie);
});

module.exports = router;
