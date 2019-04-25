// not used - express-async-errors handles this instead
module.exports = function (handler) {
    return async (req, res, next) => {
        try {
            await handler(req, res);
        }
        catch(err) {
            next(err);
        }
    };
}
