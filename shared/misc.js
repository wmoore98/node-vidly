function throwError(statusCode, message) {
    error = new Error(message || 'Something went wrong.');
    error.statusCode = statusCode || '500';
    throw error;
}
module.exports.throwError = throwError;
