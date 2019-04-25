const mongoose = require('mongoose');
const Joi = require('joi');

const genreSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        minlength: 5,
        maxlength: 50,
        trim: true
    }
});
module.exports.genreSchema = genreSchema;

const Genre = mongoose.model('Genre', genreSchema);
module.exports.Genre = Genre;

validateGenre = (genre) => {
    const schema = {
        name: Joi.string().trim().min(5).max(50).required()
    };

    return Joi.validate(genre, schema);
}
module.exports.validate = validateGenre;
