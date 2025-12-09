const express = require('express');
const router = express.Router();
const Authentication = require('../middleware/auth');
const {
  getUpload,
  processUpload
} = require('../controllers/uploadController');

// All routes require authentication
router.use(Authentication);

router.get('/upload', getUpload);
router.post('/upload', processUpload);

module.exports = router;

