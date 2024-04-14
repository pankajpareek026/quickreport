const ApiErrors = require("../../utils/apiErrors.utils");
const logoutUser = async (req, res, next) => {
    try {
        const user = req.auth.user
        const isValidUser = await User.findOne({ _id: user }, { _id: 1 })
        if (!isValidUser) {
            return next(new ApiErrors(401, "unauthorized access"));
        }  
        res.clearCookie('AUTH')
        res.json({ message: "logout successfully", type: "success" });
    } catch (error) {
        return next(error);
    }
  
  
}





module.exports = {
    logoutUser
}