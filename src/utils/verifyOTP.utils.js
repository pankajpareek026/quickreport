import Otp from "../models/otp.model.js"

const verifyOTP = async (owner, otp, type) => {
    const otpResult = await Otp.findOne({
        $and: [
            { owner: owner },
            {
                otpType: type
            },
            { otp: otp },
            {
                validTill: { $gt: Date.now() }
            }
        ]
    })

    console.log("sdd=>", otpResult)
    return {
        valid: otpResult === null ? false : true,
        data: otpResult
    }

}
export default verifyOTP;
