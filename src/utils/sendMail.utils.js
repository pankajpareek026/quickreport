import nodemailer from 'nodemailer'

async function sendMail(to, subject = "Verify Email", text = `Welcome To Quick Report`, emailContent,) {
    // const user = request.auth.User
    try {


        let mailTransporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: "noreplay.quickreport@gmail.com",
                pass: "aylxdrwizbwszpbw"
            }
        })


        let details = {
            Form: "noreplay.quickreport@gmail.com",
            to: to,
            subject: subject,
            text: text,
            html: emailContent
        }

        let mailResult = await mailTransporter.sendMail(details)


        // return mailResult
        return mailResult

    } catch (error) {
        console.log(error)
        res.json({ Error: "internal Server Error ", message: error })
    }

}

export default sendMail;
