const express = require('express');
const router = express.Router();
const Authentication = require('../middleware/auth');
const {
  getDashboard,
  resetAll
} = require('../controllers/dashboardController');

// All routes require authentication
router.use(Authentication);

router.get('/dash-bord', getDashboard);
router.get('/resetAll', resetAll);

module.exports = router;

