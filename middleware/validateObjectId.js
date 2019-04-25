const mongoose = require('mongoose');

module.exports = function(req, res, next) {
    if (!mongoose.Types.ObjectId.isValid(req.params.id))
        res.status(400).send('Invalid id format.');
    
    next();
}
