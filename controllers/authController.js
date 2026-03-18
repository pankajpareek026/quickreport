const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { sendVerificationEmail, sendWelcomeEmail } = require('../services/emailService');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET || "67@#65ygfghyfhYOUDFGH54-d45fhgg9854656";

// Register new user
const register = async (req, res) => {
  try {
    const { userName, Name, emailId, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ username: userName.toLowerCase() }, { email: emailId.toLowerCase() }]
    });

    if (existingUser) {
      return res.render('error', { message: 'User already exists' });
    }

    // Generate OTP
    const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Create new user with OTP
    const user = await User.create({
      username: userName.toLowerCase(),
      name: Name,
      email: emailId.toLowerCase(),
      password: password,
      isVerified: false,
      verificationOtp: generatedOtp,
      verificationOtpExpires: otpExpiry
    });

    // Send verification email
    try {
      await sendVerificationEmail(user.email, user.name, generatedOtp);

      // Auto-login after registration but keep unverified state
      const token = jwt.sign(
        { User: user.username, Email: user.email, UserId: user._id.toString() },
        JWT_SECRET,
        { expiresIn: '2d' }
      );

      res.cookie("AUTH", token, {
        maxAge: 2 * 24 * 60 * 60 * 1000,
        secure: true,
        httpOnly: true,
        sameSite: 'lax'
      });

      res.render("Emailvarify", { otp: generatedOtp, userEmail: user.email });
    } catch (emailError) {
      console.error('Email sending error during registration:', emailError);
      // Still show success page but notice email failure
      res.render("Rresponse", { name: Name, message: "Registered! But failed to send verification email. Please try resending from profile." });
    }
  } catch (error) {
    console.error('Registration error:', error);
    res.json({ Error: "Internal Server Error", message: error.message });
  }
};

// Login user
const login = async (req, res) => {
  try {
    const usernameorEmail = req.body.usrName;
    const passwordlog = req.body.Passlog;

    // Find user by username or email
    const user = await User.findOne({
      $or: [
        { username: usernameorEmail.toLowerCase() },
        { email: usernameorEmail.toLowerCase() }
      ]
    });

    if (!user) {
      return res.render("notregistered");
    }

    // Compare password
    const isPasswordValid = await user.comparePassword(passwordlog);
    if (!isPasswordValid) {
      return res.render("notregistered");
    }

    // Generate JWT token
    const token = jwt.sign(
      { User: user.username, Email: user.email, UserId: user._id.toString() },
      JWT_SECRET,
      { expiresIn: '2d' }
    );

    req.session.loggedin = true;
    res.cookie("AUTH", token, {
      maxAge: 2 * 24 * 60 * 60 * 1000, // 2 days
      secure: true,
      httpOnly: true,
      sameSite: 'lax'
    });

    res.render("loginsuccess", { name: user.username, Ustatus: user.isVerified });
  } catch (error) {
    console.error('Login error:', error);
    res.json({ Error: "Internal Server Error", message: error.message });
  }
};

// Get user profile
const getUser = async (req, res) => {
  try {
    const username = req.auth.User;

    if (!username) {
      return res.render("register");
    }

    const user = await User.findOne({ username: username.toLowerCase() });

    if (!user) {
      return res.render("register");
    }

    res.render("already", {
      username: user.username,
      userEmail: user.email,
      name: user.name,
      Current_Value: 0,
      invested: 0,
      b: 0,
      Dj: user.createdAt
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.render("register");
  }
};

// Email verification - send OTP
const sendEmailVerification = async (req, res) => {
  try {
    const username = req.auth.User;

    if (!username) {
      return res.redirect('/');
    }

    const user = await User.findOne({ username: username.toLowerCase() });

    if (!user) {
      return res.render("Err404");
    }

    if (user.isVerified) {
      return res.redirect('/dash-bord');
    }

    // Generate OTP
    const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

    // Update user with new OTP
    user.verificationOtp = generatedOtp;
    user.verificationOtpExpires = otpExpiry;
    await user.save();

    // Send verification email
    try {
      await sendVerificationEmail(user.email, user.name, generatedOtp);
      res.render("Emailvarify", { otp: generatedOtp, userEmail: user.email });
    } catch (emailError) {
      console.error('Email sending error:', emailError);
      return res.render("Err404", { message: "Failed to send verification email. Please try again." });
    }
  } catch (error) {
    console.error('Email verification error:', error);
    res.json({ Error: "Internal Server Error", message: error.message });
  }
};

// Verify email with OTP
const verifyEmail = async (req, res) => {
  try {
    const username = req.auth.User;

    if (!username) {
      return res.redirect('/login');
    }

    const { userotp } = req.body || req.query;

    if (!userotp) {
      return res.render("Err404", { message: "OTP is required" });
    }

    // Find user and include OTP fields which are hidden by default
    const user = await User.findOne({ username: username.toLowerCase() })
      .select('+verificationOtp +verificationOtpExpires');

    if (!user) {
      return res.render("Err404");
    }

    if (user.isVerified) {
      return res.redirect('/dash-bord');
    }

    // Validate OTP
    if (user.verificationOtp !== userotp) {
      return res.render("Emailvarify", {
        otp: "Invalid",
        userEmail: user.email,
        error: "Invalid verification code. Please try again."
      });
    }

    // Check expiry
    if (user.verificationOtpExpires < new Date()) {
      return res.render("Emailvarify", {
        otp: "Expired",
        userEmail: user.email,
        error: "Verification code has expired. Please request a new one."
      });
    }

    // Success - verify user and clear OTP fields
    user.isVerified = true;
    user.verificationOtp = undefined;
    user.verificationOtpExpires = undefined;
    await user.save();

    // Send welcome email (optional, don't block on failure)
    sendWelcomeEmail(user.email, user.name).catch(err => {
      console.log('Welcome email failed (non-critical):', err.message);
    });

    res.render("EmailSuccess");
  } catch (error) {
    console.error('Verify email error:', error);
    res.json({ Error: "Internal Server Error", message: error.message });
  }
};

// Logout
const logout = (req, res) => {
  res.clearCookie('AUTH');
  req.session.destroy();
  res.render("logout");
};

module.exports = {
  register,
  login,
  getUser,
  sendEmailVerification,
  verifyEmail,
  logout
};

