import Joi from "joi";
import * as yup from "yup";
const { object, string, ref } = Joi
import { hash } from "bcrypt";
import { User } from "../../models/users.model.js";
import { ApiErrors } from "../../utils/apiErrors.utils.js";
import { statusCode } from "../../utils/httpStatusCode.utils.js";
import { ApiRespose } from "../../utils/apiResponse.utils.js";
import { Message } from "../../utils/responseMessage.utils.js";

// const showRegisterPage = async (req, res, next) => {

//     // Express route handler for GET request to '/register'
//     // Check if 'AUTH' cookie exists in the request
//     const isAuthenticated = !!req.cookies.AUTH;

//     if (isAuthenticated) {
//         // User is already authenticated, redirect to the '/user' page
//         res.redirect('/user');
//     } else {
//         // User is not authenticated, render the 'signin' page
//         res.render('signup');
//     }
// }




const signUp = async (req, res, next) => {
    console.log(req.body);


    try {

        const registrationSchema = Joi.object({
            userName: Joi.string().alphanum().trim().min(5).max(15).label("username").required().messages({
                'string.alphanum': 'Username should only contain alphanumeric characters',
                'string.min': 'Username must be at least 5 characters long',
                'string.max': 'Username cannot exceed 15 characters',
                'any.required': 'Username is required'
            }),
            fullName: Joi.string().trim().min(2).label("Name").required().messages({
                'string.min': 'Username must be at least 2 characters long',
                'string.max': 'Username cannot exceed 15 characters',
                'any.required': 'full name is required'
            }),
            emailId: Joi.string().email().label("Email Address").required().messages({
                'string.base': 'Email should be a string',
                'string.email': 'Email should be a valid email address',
                'any.required': 'Email is required'
            }),
            password: Joi.string().trim().min(8).label("Password").required().messages({
                'string.min': 'password must be at least 8 characters long',
                'any.required': 'password is required',
                'string.empty': 'password is required',
            }),
            confirmPassword: Joi.string().valid(ref('password')).label("confirm password").required().messages({
                'any.only': 'Password and confirmation password is not match',
            })
        });

        const { error, value } = registrationSchema.validate(req.body);

        const { userName, fullName, emailId, password } = value;
        console.log("value => ", value)
        console.log("ERROR => ", error)
        if (error) {
            const formattedErrors = error.details.map((err) => ({
                // field: err.path[0],
                message: err.message.replace(/[^\w\s]/gi, '')
            }));
            // throw new Error(`${formattedErrors[0].field}: ${formattedErrors[0].message}`);

            // (stsCode = statusCode.internalServerError, message='internal Server Error', redirectUrl = null, error = true)
            return next(new ApiErrors(statusCode.badRequest, formattedErrors[0].message))

        }


        const hashedPassword = await hash(password, 10);
        const userExists = await User.findOne({
            $or: [{ username: userName }, { email: emailId }]
        })
        if (userExists) {
            // console.log(me)
            return next(new ApiErrors(statusCode.badRequest, Message.emailExists,))
        }

        const formatedJoiningDate = new Date().toLocaleString("en-IN");

        const createUSer = await User.create({
            username: userName,
            name: fullName,
            email: emailId,
            password: hashedPassword,
            isVerified: false,
            joiningDate: Date.now()
        })
        if (!createUSer._id) {
            return next(new ApiErrors(statusCode.internalServerError, Message.wentWrong, "error",))
        }
        // res.json(createUSer)
        return res.status(statusCode.ok).json(new ApiRespose(true, Message.signupSuccess,))


        // res.render("Rresponse", { name: Name });
    } catch (error) {
        console.error(error);
        return next(error)

    }
};



export default signUp



































