const mongoose = require('mongoose');
const Fawn = require('fawn');
const { Rental } = require('../models/rental');
const { Movie } = require('../models/movie');
const { getMovie } = require('./movies');
const { getCustomer } = require('./customers');
const { throwError } = require('../shared/misc');

Fawn.init(mongoose);

async function createRental({ customerId, movieId }) {
    // Validate customer
    if (!mongoose.Types.ObjectId.isValid(customerId))
        throwError(400, 'Invalid id format for customer.');

    const customer = await getCustomer(customerId);
    if (!customer) throwError(404, `Customer with ID ${customerId} not found.`);

    // Validate movie
    if (!mongoose.Types.ObjectId.isValid(movieId))
        throwError(400, 'Invalid id format for movie.');

    const movie = await getMovie(movieId);
    if (!movie) throwError(404, `Movie with ID ${movieId} not found.`);

    if (movie.numberInStock <= 0) throwError(400, 'Movie not in stock.');


    // Create new rental
    const rental = new Rental({
        customer: {
            _id: customer._id,
            name: customer.name,
            phone: customer.phone,
            isGold: customer.isGold
        },
        movie: {
            _id: movie._id,
            title: movie.title,
            dailyRentalRate: movie.dailyRentalRate
        }
    });

    try {
        new Fawn.Task()
            .save('rentals', rental)
            .update('movies', { _id: movie._id }, {
                $inc: { numberInStock: -1 }
            })
            .run();

        return rental;
    }
    catch(err) {
        throwError(500, err.message);
    }

}
module.exports.createRental = createRental;

async function getRentals() {
    return await Rental.find().sort('-dateOut');
}
module.exports.getRentals = getRentals;

async function getRental(id) {
    if (!mongoose.Types.ObjectId.isValid(id))
        throwError(400, 'Invalid id format.');

    return await Rental.findById(id);
}
module.exports.getRental = getRental;


async function updateRental({ customerId, movieId }) {
    if (!mongoose.Types.ObjectId.isValid(customerId))
        throwError(400, 'Invalid id format for customer.');

    if (!mongoose.Types.ObjectId.isValid(movieId))
        throwError(400, 'Invalid id format for movie.');

    const rental = await Rental.lookup({ customerId, movieId });

    if (!rental) throwError(404, `Rental for customer ID ${customerId} and movie ID ${movieId} not found.`);
    if (rental.dateReturned) throwError(400, `Rental for customer ID ${customerId} and movie ID ${movieId} already returned.`);

    rental.return();
    await rental.save();

    await Movie.updateOne({ _id: rental.movie._id }, {
        $inc: { numberInStock: 1 }
    });
    
    return rental;
}
module.exports.updateRental = updateRental;

async function deleteRental(id) {
    if (!mongoose.Types.ObjectId.isValid(id))
        throwError(400, 'Invalid id format');

    return await Rental
        .findByIdAndRemove(id);
}
module.exports.deleteRental = deleteRental;
