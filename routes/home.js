const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.send('Hello from Vidly - use /api/genres to manage genres via REST api');
});

module.exports = router;
