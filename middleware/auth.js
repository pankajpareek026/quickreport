const jwt = require('jsonwebtoken');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET || "67@#65ygfghyfhYOUDFGH54-d45fhgg9854656";

// Middleware to verify JWT token
const Authentication = async (req, res, next) => {
  if (req.cookies.AUTH) {
    try {
      const decoded = jwt.verify(req.cookies.AUTH, JWT_SECRET);
      req.auth = decoded;
      next();
    } catch (err) {
      console.log('JWT verification error:', err);
      res.render('error', { message: "Invalid Credentials" });
    }
  } else {
    res.render('error', { message: "Invalid Credentials" });
  }
};

module.exports = Authentication;

