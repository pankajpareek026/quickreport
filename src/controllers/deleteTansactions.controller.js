const Funding = require("../../models/funding.model")
const Portfolio = require("../../models/portfolio.model")
const User = require("../../models/users.model")
const ApiErrors = require("../../utils/apiErrors.utils")

const deleteFundingTransaction = async (req, res, next) => {
    try {
        const user = req.auth.user
        const isValidUser = await User.findOne({ _id: user }, { _id: 1 })
        if (!isValidUser) {
            return next(new ApiErrors(401, "unauthorized access"));
        }
    } catch (error) {
        return next(error);
    }
}


const deleteBuySellTransaction = async (req, res, next) => {
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
    deleteBuySellTransaction,
    deleteFundingTransaction
}