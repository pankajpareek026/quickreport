const express = require('express');
const router = express.Router();

// Public routes
router.get('/', (req, res) => {
  res.render("index");
});

router.get('/about', (req, res) => {
  res.render("about");
});

router.get('/News', (req, res) => {
  res.render("news");
});

module.exports = router;

