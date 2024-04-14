const Joi = require("joi");
const Portfolio = require("../../models/portfolio.model.js");
const ApiErrors = require("../../utils/apiErrors.utils.js");
const Funding = require("../../models/funding.model.js");
const User = require("../../models/users.model.js");
const editFundingTransaction = async (req, res, next) => {
    try {
        const user = req.auth.user
        const isValidUser = await User.findOne({ _id: user }, { _id: 1 })
        if (!isValidUser) {
            return next(new ApiErrors(401, "unauthorized access"));
        }
    } catch (error) {
        return next(error)
    }
}

const editBuySellTransaction = async (req, res, next) => {
    try {
        const user = req.auth.user
        const isValidUser = await User.findOne({ _id: user }, { _id: 1 })
        if (!isValidUser) {
            return next(new ApiErrors(401, "unauthorized access"));
        }
    } catch (error) {
        return next(error)
    }
}
module.exports = {
    editBuySellTransaction,
    editFundingTransaction
}