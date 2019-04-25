const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { User } = require('../models/user');
const { throwError } = require('../shared/misc');

async function createUser({ name, email, password, isAdmin }) {
    if (! await _isUniqueEmail(email))
        throwError(400, `Email "${email}" is already in use`);

    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(password, salt);

    const user = new User({
        name,
        email,
        password: hashed,
        isAdmin
    });

    try {
        await user.save();
        const result = await User.findById(user._id).select('-password');
        const token = user.generateAuthToken();
        return { user: result, token };
    }
    catch(err) {
        throwError(500, err.message);
    }
}
module.exports.createUser = createUser;

async function getUsers() {
    return await User.find().sort('name').select('-password');
}
module.exports.getUsers = getUsers;

async function getUser(id) {
    if (!mongoose.Types.ObjectId.isValid(id))
        throwError(400, 'Invalid id format.');

    return await User.findById(id).select('-password');
}
module.exports.getUser = getUser;

async function updateUser(id, { name, email, password, isAdmin }) {
    if (!mongoose.Types.ObjectId.isValid(id))
        throwError(400, 'Invalid id format.');

    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(password, salt);
    

// ************ since email is used as a key, should not allow change or at least take precautions ******
    return await User
        .findByIdAndUpdate(id, {
            name,
            email,
            password: hashed,
            isAdmin
        }, { new: true });
}
module.exports.updateUser = updateUser;

async function deleteUser(id) {
    if (!mongoose.Types.ObjectId.isValid(id))
        throwError(400, 'Invalid id format.');

    return await User
        .findByIdAndRemove(id);
}
module.exports.deleteUser = deleteUser;

async function _isUniqueEmail(email) {
    const user = await User.findOne({ email });
    return !user;
}
