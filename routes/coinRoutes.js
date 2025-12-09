const express = require('express');
const router = express.Router();
const { getCoinDetails } = require('../controllers/coinController');

// Public route - coin details page
router.get('/coin/:id', getCoinDetails);

module.exports = router;

