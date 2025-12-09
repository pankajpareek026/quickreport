const express = require("express");
require('dotenv').config();
const axios = require("axios");
const upload = require('express-fileupload');
const cookiesParser = require('cookie-parser');
const session = require("express-session");
const bodyparser = require("body-parser");
const path = require('path');
const connectDB = require('./config/database');

// Connect to MongoDB
connectDB();

const app = express();
const PORT = process.env.PORT || 7000;

// Middleware
app.use(express.json());
app.use(upload());
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }));
app.use(cookiesParser());

// View engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// Session configuration
app.use(
  session({
    secret: process.env.SESSION_SECRET || "secret",
    resave: true,
    saveUninitialized: true,
  })
);

// Static files (if any)
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/', require('./routes/indexRoutes'));
app.use('/', require('./routes/authRoutes'));
app.use('/', require('./routes/coinRoutes'));
app.use('/', require('./routes/portfolioRoutes'));
app.use('/', require('./routes/fundingRoutes'));
app.use('/', require('./routes/dashboardRoutes'));
app.use('/', require('./routes/uploadRoutes'));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).render('error', { message: 'Internal Server Error' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).render('error', { message: 'Page Not Found' });
});

// Start server
app.listen(PORT, (err) => {
  if (err) {
    console.error('Server error:', err);
  } else {
    console.log(`Server listening on port ${PORT}`);
  }
});

module.exports = app;
