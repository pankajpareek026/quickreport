import { Router } from "express";
import login from "../controllers/auth/login.controller.js";
import forgetPassword from "../controllers/auth/forgetPassword.controller.js";
import resetPassword from "../controllers/auth/resetPassword.controller.js";
import sendVerificationMail from "../controllers/auth/sendVerifyMail.controller.js";
import verifyEmail from "../controllers/auth/verify.controller.js";
import signUp from './../controllers/auth/signup.controller.js';
import auth from "../middlewares/auth.middleware.js";

const router = Router();

// all user Routes


// to recive signup request
router.post('/signup', signUp);


// to recive loging request
router.post('/login', login);


// to handle forget password request
router.post('/forget', forgetPassword);

// to handle reset password request
router.post('/reset',auth, resetPassword);

// to send verification mail to the client
router.get('/verify',auth, sendVerificationMail);

// to verify email 
router.post('/verify',auth, verifyEmail);


export { router as authRouter }