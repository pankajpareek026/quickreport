// Import necessary modules and utilities
const Joi = require("joi");
const cnn = require("../db/connection.js");
const convertPriceInUSD = require("../utils/convertPriceInUSD.utils.js");
const parseCryptoPair = require("../utils/parseCryptopair.js");
// const Portfolio = require("../../models/portfolio.model.js");
const ApiErrors = require("../utils/apiErrors.utils.js");
const Funding = require("../models/funding.model.js");
const User = require("../models/users.model.js");
const Transaction = require("../models/transaction.model.js");

// Middleware to show the add buy/sell page
const showAddBuySellPage = async (req, res, next) => {
    console.table(req.body)
    const user = req.auth.user;

    // Check if the user is authenticated
    if (user) {
        res.render("portfolio");
    } else {
        // Redirect to login if the user is not authenticated
        res.redirect('/login');
    }
};

// Middleware to handle the addition of buy/sell transactions



// Middleware to show the add funding page
const showAddFundingPage = async (req, res, next) => {
    const user = req.auth.user;

    // Check if the user is authenticated
    if (user) {
        res.render("MainFunding");
    } else {
        // Redirect to login if the user is not authenticated
        res.redirect('/login');
    }
};

// Middleware to handle the addition of funding transactions


// Helper function to format numbers with specified precision


// Export the middleware functions
module.exports = {
    addBuySellTransaction,
    addFundingTransaction,
    showAddBuySellPage,
    showAddFundingPage
};
