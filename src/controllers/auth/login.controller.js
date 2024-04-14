import bcrypt from 'bcrypt';
// import cnn from '../../db/connection.js';
import jwt from "jsonwebtoken";

import { ApiRespose } from '../../utils/apiResponse.utils.js';
import { ApiErrors } from '../../utils/apiErrors.utils.js';
import { statusCode } from '../../utils/httpStatusCode.utils.js';
import jwtUtil from '../../utils/jwt.util.js';




// Function to show the login page
// const showLoginPage = async (req, res, next) => {
//   // Log the access token from cookies
//   console.log("accesstoken =>", req.cookies.AUTH)
//   console.log(req)
//   // Check if the user is already authenticated using a JWT
//   if (req.cookies.AUTH) {
//     // Verify the JWT
//     const jwtResult = await verifyToken(req.cookies.AUTH, process.env.JWT_KEY)

//     // Log JWT verification result and current date
//     // console.log("jwtResult =>", jwtResult)
//     // const date = Date.now()
//     // console.log("expiry :=>", jwtResult.exp, ", now =>", date)
//     // console.log("login jwt result :=>", jwtResult)
//     if (jwtResult.type == "error") {
//       res.clearCookie('AUTH')
//       return res.status(403).json(jwtResult)
//     }

//     // Redirect to the dashboard if the user is authenticated
//     // return res.redirect('/dash-bord')
//   }

//   // Render the login page if the user is not authenticated
//   res.render("login");
// }


// Function to handle user login
const login = async (req, res, next) => {
  console.log(req.body);
  const { usernameorEmail, loginPass } = req.body;

  try {
    // Check if both username/email and password are provided

    if (!usernameorEmail || !loginPass) {
      return next(new ApiErrors(statusCode.badRequest, "email or password required !"))
    }

    // Find the user by email or username
    const user = await findOne({
      $or: [{ "email": usernameorEmail }, { "username": usernameorEmail }]
    });

    // Return a warning if the user is not found
    if (!user) {

      return next(new ApiErrors(statusCode.notFound, 'user does not exist'))
    }

    // Check if the provided password is correct
    const isCorrect = await user.isPasswordCorrect(loginPass);

    // Return a warning if the password is incorrect
    if (!isCorrect) {
      return next(new ApiErrors(statusCode.badRequest, 'Invalid password'));
    }


    // Create a JWT for the authenticated user
    const token = await createToken({ user: user._id }, process.env.JWT_KEY, { expiresIn: "27d" });

    // Check if there was an error creating the token
    if (token.data == null) {

      return next(new ApiErrors(statusCode.internalServerError, 'Internal Server Error'))
    }

    // Set the JWT as a cookie and send a success response
    return res.cookie("auth", 'Bearer' + token.data, {
      expiresIn: '27d',
      secure: true,
      httpOnly: true,
      sameSite: 'lax',
      path: "/"
    }).status(200).json(new ApiRespose(
      true,
      'Logged in successfully',
      '/dashboard',
      {
        auth: 'Bearer' + token.data
      }));


  } catch (error) {
    // Log and return an error response if an exception occurs
    console.error(error);
    // res.status(500).json({
    //   type: "error",
    //   title: "Internal Server Error",
    //   message: error.message,
    // });
    return next(new ApiErrors(statusCode.internalServerError, 'internal server error'))
  }
};

// Export the functions for use in other modules
export default login
