const express = require('express');
const router = express.Router();

router.all('*', (req, res) => {
    console.log('404');
    res.status(404).send('I searched high and low, far and near, but could not find the requested resource. Perhaps you mistyped? Invalid URL');
});
module.exports = router;
