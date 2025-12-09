const express = require('express');
const router = express.Router();
const Authentication = require('../middleware/auth');
const {
  getFunding,
  addFunding,
  resetFunding
} = require('../controllers/fundingController');

// All routes require authentication
router.use(Authentication);

router.get('/funding', getFunding);
router.post('/funding', addFunding);
router.get('/resetF', resetFunding);

module.exports = router;

