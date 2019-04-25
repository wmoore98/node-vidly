const mongoose = require('mongoose');
const { Genre } = require('../models/genre');
const { throwError } = require('../shared/misc');

async function createGenre({ name }) {
    if (! await _isUniqueGenre(name))
        throwError(400, `Genre "${name}" is already in use`);

    const genre = new Genre({
        name
    });
    
    return await genre.save();
}
module.exports.createGenre = createGenre;

async function getGenres() {
    return await Genre
        .find()
        .sort({ name: 1 })
        .select({ name: 1 });
}
module.exports.getGenres = getGenres;

async function getGenre(id) {
    if (!mongoose.Types.ObjectId.isValid(id))
        throwError(400, 'Invalid id format');

    return await Genre
        .findById(id)
        .select({ name: 1 });
}
module.exports.getGenre = getGenre;

async function updateGenre(id, newGenre) {
    if (!mongoose.Types.ObjectId.isValid(id))
        throwError(400, 'Invalid id format');

    return await Genre
        .findByIdAndUpdate(id, { name: newGenre.name }, { new: true });
}
module.exports.updateGenre = updateGenre;

async function deleteGenre(id) {
    if (!mongoose.Types.ObjectId.isValid(id))
        throwError(400, 'Invalid id format');

    return await Genre
        .findByIdAndRemove(id);
}
module.exports.deleteGenre = deleteGenre;

async function _isUniqueGenre(name) {
    const genre = await Genre.findOne({ name });
    return !genre;
}
