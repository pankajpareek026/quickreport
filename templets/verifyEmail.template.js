const generateVerifyEmailTemplate = (otp, name = 'User') => {
    return `<body style="margin: 0; padding: 0; font-family: 'Arial', sans-serif; background-color: #1c1c1c; color: #ffffff;">
    <table
        style="width: 97%; max-width: 600px; margin: 20px auto; padding: 20px; background-color: #2c2c2c; border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);"
        cellpadding="0" cellspacing="0">
        <!-- Header -->
        <tr>
            <td style="text-align: center; padding: 20px;">
            <img src="https://i.ibb.co/xMYYFwC/flogo.png" alt="QuickReport Logo"
            style="max-width: 150px;max-height: 150px; height: 75px; width: 75px;">
                <h1
                    style="margin: 0; width: 100%; font-size: 32px; color: #f88605; text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);">
                    Verify Your Email</h1>
            </td>
        </tr>

        <tr>
            <td style="padding: 20px; font-size: 16px; line-height: 1.5;">
                <p>Dear ${name},</p>
                <p>To verify your email address, please enter the OTP code below:</p>
                <div
                    style="text-align: center; margin-top: 20px; background-color: #333333; padding: 10px; border-radius: 5px;">
                    <p style="font-size: 24px; color: #f88605; margin-bottom: 10px;"><strong
                            style="font-size: 2.7rem; font-family:  Courier">${otp}</strong></p>
                    <p style="font-size: 14px; color: #cccccc;">(This OTP is valid for 10 minutes)</p>
                </div>
                <p>If you didn't create an account, please ignore this email.</p>
                <p style="text-align: center; margin-top: 20px;"><a href="#"
                        style="color: #f88605; text-decoration: none; border-bottom: 1px solid #f88605; display: inline-block;">Need
                        Help?</a>
                </p>
            </td>
        </tr>
        <!-- Footer -->
        <tr>
            <td style="text-align: center; padding: 20px; font-size: 12px; color: #cccccc;">
                <p>This email was sent to you by <a href="#"
                        style="color: #f88605; text-decoration: none;">QuickReport</a> to verify your email address.</p>
            </td>
        </tr>
    </table>
</body>

`

}

export default generateVerifyEmailTemplate;