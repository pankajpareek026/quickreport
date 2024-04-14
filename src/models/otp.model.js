import mongoose from "mongoose";

const OtpSchema = mongoose.Schema({
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        validator: async function (value) {
            const user = await mongoose.model('user').findOne({ _id: value });
            return !!user;
        }
    },
    otpType: {
        type: string,
        enum: ['verify', 'reset', 'validate', 'reset'],
        default: "verify"
    },
    otp: {
        type: Number,
        max: 6,
        min: 6
    },
    validTill: {
        type: BigInt,
    }

})

const otpModal = mongoose.model('otp', OtpSchema)

const Otp = otpModal
export default Otp;