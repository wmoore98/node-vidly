const mongoose = require('mongoose');
const { Movie } = require('../models/movie');
const { getGenre } = require('./genres');
const { throwError } = require('../shared/misc');

async function createMovie({ title, numberInStock, dailyRentalRate, genreId }) {
    if (!mongoose.Types.ObjectId.isValid(genreId))
        throwError(400, 'Invalid id format for genre.');

    const genre = await getGenre(genreId);
    if (!genre) throwError(404, `Genre with ID ${genreId} not found.`);

    const movie = new Movie({
        title,
        genre: {
            _id: genre._id,
            name: genre.name
        },
        numberInStock,
        dailyRentalRate
    });
    
    return await movie.save();
}
module.exports.createMovie = createMovie;

async function getMovies() {
    return await Movie
        .find()
        .sort({ title: 1 })
        .select('title genre.name numberInStock dailyRentalRate');
}
module.exports.getMovies = getMovies;

async function getMovie(id) {
    if (!mongoose.Types.ObjectId.isValid(id))
        throwError(400, 'Invalid id format.');

    return await Movie
        .findById(id)
        .select('title genre.name numberInStock dailyRentalRate');
}
module.exports.getMovie = getMovie;

async function updateMovie(id, { title, numberInStock, dailyRentalRate, genreId }) {
    if (!mongoose.Types.ObjectId.isValid(id))
        throwError(400, 'Invalid id format.');

    if (!mongoose.Types.ObjectId.isValid(genreId))
        throwError(400, 'Invalid id format for genre.');

    const genre = await getGenre(genreId);
    if (!genre) throwError(404, `Genre with ID ${genreId} not found.`);
    
    return await Movie
        .findByIdAndUpdate(id, {
            title,
            genre: {
                _id: genre._id,
                name: genre.name
            },
            numberInStock,
            dailyRentalRate
        }, {
            new: true,
            runValidators: true
        });
}
module.exports.updateMovie = updateMovie;

async function deleteMovie(id) {
    if (!mongoose.Types.ObjectId.isValid(id))
        throwError(400, 'Invalid id format.');

    return await Movie
        .findByIdAndRemove(id);
    
}
module.exports.deleteMovie = deleteMovie;
