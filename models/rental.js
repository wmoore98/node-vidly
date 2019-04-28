const mongoose = require('mongoose');
const Joi = require('joi');
const moment = require('moment');

const rentalSchema = new mongoose.Schema({
    customer: {
        type: new mongoose.Schema({
            name: {
                type: String,
                required: true,
                minlength: 5,
                maxlength: 50,
                trim: true
            },
            phone: {
                type: String,
                required: true,
                minlength: 10,
                maxlength: 20,
                trim: true
            },
            isGold: {
                type: Boolean,
                required: true,
                default: false
            }
        }),
        required: true
    },
    movie: {
        type: new mongoose.Schema({
            title: {
                type: String,
                required: true,
                minlength: 5,
                maxlength: 255,
                trim: true
            },
            dailyRentalRate: {
                type: Number,
                required: true,
                min: 0,
                max: 255
            }
        }),
        required: true
    },
    dateOut: {
        type: Date,
        required: true,
        default: Date.now
    },
    dateReturned: {
        type: Date
    },
    rentalFee: {
        type: Number,
        min: 0
    }
});

rentalSchema.statics.lookup = function({ customerId, movieId }) {
    return this.findOne({
        'customer._id': customerId,
        'movie._id': movieId
    });
};

rentalSchema.methods.return = function() {
    this.dateReturned = new Date();

    const days = moment().diff(this.dateOut, 'days');
    this.rentalFee =  days * this.movie.dailyRentalRate;
}

const Rental = mongoose.model('Rental', rentalSchema);
module.exports.Rental = Rental;

validateRental = (rental) => {
    const schema = {
        customerId: Joi.objectId().required(),
        movieId: Joi.objectId().required()
    };

    return Joi.validate(rental, schema);
}
module.exports.validate = validateRental;
