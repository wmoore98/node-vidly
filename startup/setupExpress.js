const express = require('express');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const logger = require('../shared/logger');

module.exports = function(app) {

    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(express.static('public'));
    if (app.get('env') === 'production' ) {
        app.use(helmet());
        app.use(compression());
        logger.info('Production environment - using helmet and compression.')
    }

    if (app.get('env') === 'development' || app.get('env') === 'test' ) {
        app.use(morgan('tiny'));
        logger.info('Development/test environment - morgan enabled.')
    }
}
