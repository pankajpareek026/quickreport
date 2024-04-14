import crypto from 'crypto';
import nodemailer from 'nodemailer'
const sendMail = async (from, to,subject, content ,otp) => {
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
            subject: "Verify Email",
            text: `Welcome To Quick Report `,
            html: content
        }
        let mailResult = await mailTransporter.sendMail(details)



        console.log(" Mail Result =>", mailResult)



    } catch (error) {
        console.log(error)
        res.json({ Error: "internal Server Error ", message: error })
    }

}

// sendMail("na", 'pankajpareek.dev@gmail.com', 115522, `<body><p>OTP :<strong>${Math.floor(Math.random() * 10000 + 251)}</strong></p></body>`)

export default sendMail
















// Mail Template
// `<body style="font-family:'Source Serif 4', sans-serif;">
//             <b
//                 style="color:rgb(7, 7, 7) ;margin-bottom: 0px;margin-top: 25px; ;font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
//                 welcome , <p
//                     style="font-family:'Source Serif 4', sans-serif; color: rgb(13, 213, 248);margin:2px;font-weight: 300;">
//                     ${name}</p>
//            </b>
//             <br>
//             <div style="text-align:left;">
//                 <P style="color:rgb(17, 17, 17) margin :0px; font-size: small; text-align: left; font-weight: 500; font-size: large;">
//                     Registration Was Successfull please verify your
//                     email address !</P>
//                 <p style="font-family:'Source Serif 4',font-weight:100px sans-serif;"> Your Email Varification Code</p>
//                 <p style="font-size: xx-large; color:#f88605; font-weight:bold;  ">
//                     ${otp}
//                 </p>
//                 <p style="text-align: left; font-weight: 900;color: rgb(6, 6, 6); font-size: large;">Regards </p>
//                 <p style="text-align: left; color: #3b3b3a; margin-top:-15px ;margin-left: 15px;">Team QuickReport </p>
//                 <p style="text-align:right">${emailTime}</p>
//                 <hr>
//                 <p style="text-align: center; font-weight:900;">Powered By OrangeDevs</p>
//             </div>
//         </body>`