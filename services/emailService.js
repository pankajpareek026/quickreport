const nodemailer = require('nodemailer');
require('dotenv').config();

/**
 * Email Service for QuickReport
 * Handles all email sending functionality with consistent design
 */

// Create reusable transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER || "noreplay.quickreport@gmail.com",
      pass: process.env.EMAIL_PASS || "aylxdrwizbwszpbw"
    }
  });
};

/**
 * Generate email verification HTML template
 * Matches QuickReport design theme
 */
const generateVerificationEmailTemplate = (userName, otp, timestamp) => {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Email Verification - QuickReport</title>
    <style>
        /* Reset styles */
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Roboto Mono', 'Source Serif 4', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            background-color: #0C0E12;
            color: #ffffff;
            line-height: 1.6;
            padding: 20px;
        }
        
        .email-container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #201f1f;
            border-radius: 15px;
            overflow: hidden;
            box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.5);
        }
        
        .email-header {
            background: linear-gradient(135deg, #f88605 0%, #d66d04 100%);
            padding: 30px 20px;
            text-align: center;
        }
        
        .email-header h1 {
            color: #ffffff;
            font-size: 28px;
            font-weight: 700;
            margin: 0;
            letter-spacing: 1px;
        }
        
        .email-body {
            padding: 40px 30px;
            background-color: #201f1f;
        }
        
        .greeting {
            color: #ffffff;
            font-size: 18px;
            margin-bottom: 20px;
            font-weight: 500;
        }
        
        .greeting .name {
            color: #f88605;
            font-weight: 700;
        }
        
        .message {
            color: #bbbbbb;
            font-size: 16px;
            margin-bottom: 30px;
            line-height: 1.8;
        }
        
        .otp-container {
            background-color: #17181e;
            border: 2px solid #f88605;
            border-radius: 10px;
            padding: 30px;
            text-align: center;
            margin: 30px 0;
        }
        
        .otp-label {
            color: #979191;
            font-size: 14px;
            text-transform: uppercase;
            letter-spacing: 1px;
            margin-bottom: 15px;
        }
        
        .otp-code {
            color: #f88605;
            font-size: 42px;
            font-weight: 700;
            letter-spacing: 8px;
            font-family: 'Roboto Mono', monospace;
            text-shadow: 0px 2px 10px rgba(248, 134, 5, 0.3);
        }
        
        .info-box {
            background-color: #24262b;
            border-left: 4px solid #05c2fc;
            padding: 15px 20px;
            margin: 25px 0;
            border-radius: 5px;
        }
        
        .info-box p {
            color: #bbbbbb;
            font-size: 14px;
            margin: 0;
        }
        
        .footer {
            background-color: #17181e;
            padding: 25px 30px;
            text-align: center;
            border-top: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        .footer-text {
            color: #979191;
            font-size: 13px;
            margin-bottom: 10px;
        }
        
        .footer-brand {
            color: #f88605;
            font-size: 16px;
            font-weight: 700;
            margin-top: 15px;
        }
        
        .footer-powered {
            color: #979191;
            font-size: 12px;
            margin-top: 10px;
        }
        
        .timestamp {
            color: #979191;
            font-size: 12px;
            text-align: right;
            margin-top: 20px;
            padding-top: 20px;
            border-top: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        /* Responsive styles */
        @media only screen and (max-width: 600px) {
            body {
                padding: 10px;
            }
            
            .email-container {
                border-radius: 10px;
            }
            
            .email-header {
                padding: 20px 15px;
            }
            
            .email-header h1 {
                font-size: 24px;
            }
            
            .email-body {
                padding: 30px 20px;
            }
            
            .otp-code {
                font-size: 32px;
                letter-spacing: 4px;
            }
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="email-header">
            <h1>🚀 QuickReport</h1>
        </div>
        
        <div class="email-body">
            <div class="greeting">
                Welcome, <span class="name">${userName}</span>!
            </div>
            
            <div class="message">
                Your registration was successful! To complete your account setup and start tracking your cryptocurrency portfolio, please verify your email address using the verification code below.
            </div>
            
            <div class="otp-container">
                <div class="otp-label">Your Verification Code</div>
                <div class="otp-code">${otp}</div>
            </div>
            
            <div class="info-box">
                <p><strong>⚠️ Important:</strong> This code will expire in 10 minutes. If you didn't request this code, please ignore this email.</p>
            </div>
            
            <div class="timestamp">
                Sent: ${timestamp}
            </div>
        </div>
        
        <div class="footer">
            <div class="footer-text">Thank you for choosing QuickReport</div>
            <div class="footer-brand">QuickReport Team</div>
            <div class="footer-powered">Powered by OrangeDevs</div>
        </div>
    </div>
</body>
</html>
  `;
};

/**
 * Send email verification OTP
 * @param {String} userEmail - Recipient email address
 * @param {String} userName - User's name
 * @param {Number} otp - 6-digit OTP code
 * @returns {Promise} Email sending result
 */
const sendVerificationEmail = async (userEmail, userName, otp) => {
  try {
    const transporter = createTransporter();
    const timestamp = new Date().toLocaleString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZoneName: 'short'
    });

    const mailOptions = {
      from: `"QuickReport" <${process.env.EMAIL_USER || "noreplay.quickreport@gmail.com"}>`,
      to: userEmail,
      subject: "🔐 Email Verification - QuickReport",
      text: `Welcome to QuickReport, ${userName}!\n\nYour email verification code is: ${otp}\n\nThis code will expire in 10 minutes.\n\nIf you didn't request this code, please ignore this email.\n\nRegards,\nQuickReport Team`,
      html: generateVerificationEmailTemplate(userName, otp, timestamp)
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('✅ Verification email sent successfully to:', userEmail);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error('❌ Error sending verification email:', error);
    throw new Error(`Failed to send verification email: ${error.message}`);
  }
};

/**
 * Send welcome email (after successful verification)
 * @param {String} userEmail - Recipient email address
 * @param {String} userName - User's name
 * @returns {Promise} Email sending result
 */
const sendWelcomeEmail = async (userEmail, userName) => {
  try {
    const transporter = createTransporter();
    
    const welcomeTemplate = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome - QuickReport</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: 'Roboto Mono', 'Source Serif 4', sans-serif;
            background-color: #0C0E12;
            color: #ffffff;
            padding: 20px;
        }
        .email-container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #201f1f;
            border-radius: 15px;
            overflow: hidden;
            box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.5);
        }
        .email-header {
            background: linear-gradient(135deg, #22ca19 0%, #1a9d13 100%);
            padding: 30px 20px;
            text-align: center;
        }
        .email-header h1 {
            color: #ffffff;
            font-size: 28px;
            font-weight: 700;
        }
        .email-body {
            padding: 40px 30px;
        }
        .greeting {
            color: #ffffff;
            font-size: 20px;
            margin-bottom: 20px;
        }
        .greeting .name {
            color: #22ca19;
            font-weight: 700;
        }
        .message {
            color: #bbbbbb;
            font-size: 16px;
            line-height: 1.8;
            margin-bottom: 30px;
        }
        .cta-button {
            display: inline-block;
            background-color: #f88605;
            color: #ffffff;
            padding: 15px 30px;
            text-decoration: none;
            border-radius: 8px;
            font-weight: 700;
            margin: 20px 0;
            transition: all 0.3s ease;
        }
        .footer {
            background-color: #17181e;
            padding: 25px 30px;
            text-align: center;
            border-top: 1px solid rgba(255, 255, 255, 0.1);
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="email-header">
            <h1>✅ Email Verified!</h1>
        </div>
        <div class="email-body">
            <div class="greeting">Hello <span class="name">${userName}</span>!</div>
            <div class="message">
                Your email has been successfully verified. You can now access all features of QuickReport and start tracking your cryptocurrency portfolio!
            </div>
            <div style="text-align: center;">
                <a href="${process.env.APP_URL || 'http://localhost:7000'}/dash-bord" class="cta-button">Go to Dashboard</a>
            </div>
        </div>
        <div class="footer">
            <div style="color: #979191;">Thank you for using QuickReport</div>
            <div style="color: #f88605; font-weight: 700; margin-top: 10px;">QuickReport Team</div>
        </div>
    </div>
</body>
</html>
    `;

    const mailOptions = {
      from: `"QuickReport" <${process.env.EMAIL_USER || "noreplay.quickreport@gmail.com"}>`,
      to: userEmail,
      subject: "✅ Welcome to QuickReport - Email Verified!",
      text: `Hello ${userName}!\n\nYour email has been successfully verified. You can now access all features of QuickReport!\n\nRegards,\nQuickReport Team`,
      html: welcomeTemplate
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('✅ Welcome email sent successfully to:', userEmail);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error('❌ Error sending welcome email:', error);
    // Don't throw - welcome email is optional
    return { success: false, error: error.message };
  }
};

module.exports = {
  sendVerificationEmail,
  sendWelcomeEmail,
  createTransporter
};

