const mongoose = require('mongoose');
const logger = require('../shared/logger');
const config = require('config');

module.exports = function() {
    const db = config.get('db');
    mongoose.connect(db, {
        useNewUrlParser: true,
        useFindAndModify: false,
        useCreateIndex: true
    }).then(() => logger.info(`Connected to ${db}...`));
}
