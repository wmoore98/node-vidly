const mongoose = require('mongoose');
const Joi = require('joi');

const { genreSchema } = require('./genre');

const movieSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 255,
        trim: true
    },
    genre: {
        type: genreSchema,
        required: true
    },
    numberInStock: {
        type: Number,
        required: true,
        min: 0,
        max: 255
    },
    dailyRentalRate: {
        type: Number,
        required: true,
        min: 0,
        max: 255
    }
});
module.exports.movieSchema = movieSchema;

const Movie = mongoose.model('Movie', movieSchema);
module.exports.Movie = Movie;

validateMovie = (movie) => {
    const schema = {
        title: Joi.string().trim().min(5).max(50).required(),
        genreId: Joi.objectId().required(),
        numberInStock: Joi.number().min(0).integer().required(),
        dailyRentalRate: Joi.number().min(0).precision(2).required()
    };

    return Joi.validate(movie, schema);
}
module.exports.validate = validateMovie;
