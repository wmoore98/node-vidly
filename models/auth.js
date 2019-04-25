const mongoose = require('mongoose');
const Joi = require('joi');

const Auth = mongoose.model('Auth', new mongoose.Schema({
    email: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 255,
        trim: true
    },
    password: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 1024
    },
    dateLogin: {
        type: Date,
        required: true,
        default: Date.now
    },
    dateLogout: {
        type: Date
    }
}));
module.exports.Auth = Auth;

validateAuth = (auth) => {
    const schema = {
        email: Joi.string().trim().min(5).max(255).required().email(),
        password: Joi.string().trim().min(5).max(255).required()
    };

    return Joi.validate(auth, schema);
}
module.exports.validate = validateAuth;
