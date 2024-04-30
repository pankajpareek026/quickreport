import { statusCode } from "../utils/httpStatusCode.utils.js"
import jwtUtil from "../utils/jwt.util.js"
const privateKey = process.env.JWT_KEY
const auth = async (req, res, next) => {
    console.log("Authentication")
    const bearedToken = req.cookies.auth
    console.log("bearer Token: " + bearedToken)
    if (req.cookies.auth) {
        try {
            const token =await bearedToken.split('Bearer')[1]
            console.log("Token: " + token)
            console.log("Token: " + token)

            // verify token which is send by user through cookies
            const verificationResult = await jwtUtil.verifyToken(token, privateKey)

            // if token verification failed
            if (!verificationResult.verified) {

                // return error if token verification failed
                return res.status(statusCode.unauthorized).json({
                    error: true,
                    message: 'unauthorized access'
                })
            }

            // pass to the next with user credentials
            req.auth = verificationResult?.data
            console.log(verificationResult)
            next()

        }
        catch (err) {
            console.log(err.message)
            // res.json({ Error: err })
            throw new Error(err.message)
        }
    }
    else {
        res.status(statusCode.badRequest).json({
            error: true,
            message: 'unauthorized access'
        })
    }
}

export default auth