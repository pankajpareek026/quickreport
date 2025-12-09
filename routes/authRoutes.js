const express = require('express');
const router = express.Router();
const Authentication = require('../middleware/auth');
const {
  register,
  login,
  getUser,
  sendEmailVerification,
  verifyEmail,
  logout
} = require('../controllers/authController');

// Public routes
router.get('/register', (req, res) => {
  if (req.cookies.AUTH) {
    res.redirect('/user');
  } else {
    res.render('signin');
  }
});

router.post('/register', register);

router.get('/login', (req, res) => {
  if (!req.cookies.AUTH) {
    res.render("login");
  } else {
    res.redirect('/user');
  }
});

router.post('/login', login);

// Protected routes
router.get('/user', Authentication, getUser);
router.get('/emailvarification', Authentication, sendEmailVerification);
router.get('/v', Authentication, verifyEmail);
router.get('/logout', Authentication, logout);

module.exports = router;

