const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { Auth } = require('../models/auth');
const { User } = require('../models/user');
const { throwError } = require('../shared/misc');

async function createAuth({ email, password }) {
    const user = await User.findOne({ email });
    if (!user) throwError(400, `Email and/or password is invalid`);

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) throwError(400, `Email and/or password is invalid`);
    
    const auth = new Auth({
        email,
        password: user.password
    });

    await auth.save();
    const token = user.generateAuthToken();
    return token;
}
module.exports.createAuth = createAuth;
