const mongoose = require('mongoose');
const { Customer } = require('../models/customer');
const { throwError } = require('../shared/misc');

async function createCustomer(newCustomer) {
    const customer = new Customer({
        name: newCustomer.name,
        phone: newCustomer.phone,
        isGold: newCustomer.isGold
    });
    
    return await customer.save();
}
module.exports.createCustomer = createCustomer;

async function getCustomers() {
    return await Customer
        .find()
        .sort({ name: 1 })
        .select('name phone isGold');
}
module.exports.getCustomers = getCustomers;

async function getCustomer(id) {
    if (!mongoose.Types.ObjectId.isValid(id))
        throwError(400, 'Invalid id format');

    return await Customer
        .findById(id)
        .select('name phone isGold');
}
module.exports.getCustomer = getCustomer;

async function updateCustomer(id, newCustomer) {
    if (!mongoose.Types.ObjectId.isValid(id))
        throwError(400, 'Invalid id format');

        return await Customer
        .findByIdAndUpdate(id, {
            name: newCustomer.name,
            phone: newCustomer.phone,
            isGold: newCustomer.isGold
        }, {
            new: true,
            runValidators: true
        });
}
module.exports.updateCustomer = updateCustomer;

async function deleteCustomer(id) {
    if (!mongoose.Types.ObjectId.isValid(id))
        throwError(400, 'Invalid id format');

    return await Customer
        .findByIdAndRemove(id);
    
}
module.exports.deleteCustomer = deleteCustomer;
