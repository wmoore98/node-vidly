const mongoose = require('mongoose');
const Joi = require('joi');
const jwt = require('jsonwebtoken');
const config = require('config');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
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
    isAdmin: {
        type: Boolean,
        default: false
    }
});

userSchema.methods.generateAuthToken = function() {
    return jwt.sign({ _id: this._id, isAdmin: this.isAdmin }, config.get('jwtPrivateKey'));
};

userSchema.methods.getPasswordRegex = getPasswordRegex;

const User = mongoose.model('User', userSchema);
module.exports.User = User;

function validateUser(user) {
    const schema = {
        name: Joi.string().trim().min(5).max(50).required(),
        email: Joi.string().trim().min(5).max(255).required().email(),
        password: Joi.string().trim().min(5).max(72).required().regex(getPasswordRegex()),
        isAdmin: Joi.boolean().default(false)
    };

    return Joi.validate(user, schema);
}
module.exports.validate = validateUser;


/*
    /^            : Start
    (?=.{8,})        : Length
    (?=.*[a-zA-Z])   : Letters
    (?=.*\d)         : Digits
    (?=.*[!#$%&? "]) : Special characters
    $/              : End

        (/^
        (?=.*\d)                //should contain at least one digit
        (?=.*[a-z])             //should contain at least one lower case
        (?=.*[A-Z])             //should contain at least one upper case
        [a-zA-Z0-9]{8,}         //should contain at least 8 from the mentioned characters

        $/)

Example:-   /^(?=.*\d)(?=.*[a-zA-Z])[a-zA-Z0-9]{7,}$/
*/

function getPasswordRegex() {
    // Must contain at least one digit
    // Must contain at least one lower case
    // Must contain at least one upper case
    // Must contain at least one special character
    // Cannot contain any other characters
    // Minimum length is 5, maximum length is 72
    let result = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*?])[a-zA-Z0-9!@#$%^&*?]{5,72}$/;
    return result;
};
