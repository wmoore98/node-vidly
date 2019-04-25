const mongoose = require('mongoose');
const Joi = require('joi');

const customerSchema = new mongoose.Schema({
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
        required: true
    }
});
module.exports.customerSchema = customerSchema;

const Customer = mongoose.model('Customer', customerSchema);
module.exports.Customer = Customer;

validateCustomer = (customer) => {
    const schema = {
        name: Joi.string().trim().min(5).max(50).required(),
        phone: Joi.string().trim().min(10).max(20).required(),
        isGold: Joi.boolean().default(false)
    };

    return Joi.validate(customer, schema);
}
module.exports.validate = validateCustomer;
