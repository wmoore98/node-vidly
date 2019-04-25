const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');

const home = require('../routes/home');
const users = require('../routes/users');
const auth = require('../routes/auth');
const genres = require('../routes/genres');
const customers = require('../routes/customers');
const movies = require('../routes/movies');
const rentals = require('../routes/rentals');
const notFound404 = require('../routes/notFound404');
const error = require('../middleware/error');

module.exports = function(app) {

    app.use(helmet());
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(express.static('public'));

        if (app.get('env') === 'development' || app.get('env') === 'test' ) {
        app.use(morgan('tiny'));
    }
    
    // Routes
    app.use('/', home);
    app.use('/api/users', users);
    app.use('/api/auth', auth);
    app.use('/api/genres', genres);
    app.use('/api/customers', customers);
    app.use('/api/movies', movies);
    app.use('/api/rentals', rentals);
    app.use('*', notFound404);

    // Final route
    app.use(error);

}