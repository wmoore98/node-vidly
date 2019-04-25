const logger = require('../shared/logger');

module.exports = function(err, req, res, next) {
    const statusCode = +err.statusCode || 500;
    const message = err.message || 'Something went wrong';

    // If server error, log it
    if (statusCode >= 500) {
      logger.log({
          level: 'error',
          message: message,
          metadata: err
      });
    }

    res.status(statusCode).send(message);
}
