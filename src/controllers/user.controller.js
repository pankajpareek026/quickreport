/*-----------------Controllers------------- */

/*

1. LoginController
2. SignupController
3. forgetPasswordController
4. changeCurrencyController

*/


const User = require("../../models/users.model");

const userInfo = async (req, res, next) => {
    try {
        const user = req.auth.user
        console.log("user req", user)
        const isValidUser = await User.findOne({ _id: user }, { _id: 1 })
        if (!isValidUser) {
            return next(new ApiErrors(401, "unauthorized access"));
        }
        const userInfo = await User.findOne({ _id: user }, { name: 1, username: 1, jsoiningDate: 1 })
        res.json(userInfo);
    } catch (error) {
        return next(error);
    }
}

module.exports = userInfo