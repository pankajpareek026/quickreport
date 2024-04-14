import { statusCode } from "../utils/httpStatusCode.utils"
import jwtUtil from "../utils/jwt.util"
const privateKey = process.env.JWT_KEY
const auth = async (req, res, next) => {
    console.log("Authentication")
    const bearedToken = req.cookies.AUTH
    if (req.cookies.AUTH) {
        try {
            const token = bearedToken.split()[1]
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
            console.log(result)
            next()


            console.log(autherised)


        }
        catch (err) {
            console.log(err.message)
            // res.json({ Error: err })
            throw new Error(err.message)
        }
    }
    else {
        res.render('error', { message: "Invalid Credentials" })
    }
}

export default auth