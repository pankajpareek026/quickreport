import { ApiRespose } from '../../utils/apiResponse.utils.js';
import { ApiErrors } from '../../utils/apiErrors.utils.js';
import { statusCode } from '../../utils/httpStatusCode.utils.js';
import jwtUtil from '../../utils/jwt.util.js';
import { UserModel } from '../../models/users.model.js';
import { Message } from '../../utils/responseMessage.utils.js';



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
    const user = await UserModel.findOne({
      $or: [{ "email": usernameorEmail }, { "username": usernameorEmail }]
    });

    console.log("USER =>", user)
    // Return a warning if the user is not found
    if (!user) {

      return next(new ApiErrors(statusCode.notFound, 'user does not exist'))
    }

    // Check if the provided password is correct
    const isCorrect = await user.isPasswordCorrect(loginPass);

    // Return a warning if the password is incorrect
    if (!isCorrect) {
      return next(new ApiErrors(statusCode.badRequest, Message.wrongPass));
    }


    // Create a JWT for the authenticated user
    const token = await jwtUtil.createToken({ user: user._id }, process.env.JWT_KEY, { expiresIn: "27d" });

    // Check if there was an error creating the token
    if (token.data == null) {

      return next(new ApiErrors(statusCode.internalServerError, Message.internalError))
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
      Message.loginSuccess,
      {
        auth: 'Bearer' + token.data
      },
      user.isVerified ? '/dashboard' : "/verify",
    ));


  } catch (error) {

    return next(new Error(error.message))
  }
};

// Export the functions for use in other modules
export default login
