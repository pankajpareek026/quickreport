import mongoose from "mongoose";

const OtpSchema = mongoose.Schema({
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        validator: async function (value) {
            const user = await mongoose.model('user').findOne({ _id: value });
            return !!user;
        }
    },
    email: {
        type: String,
        required: true,
    },
    otpType: {
        type: String,
        enum: ['verify', 'forget', 'reset'],
        default: "verify"
    },
    otp: {
        type: Number,
        max: 999999,
        min: 6
    },
    validTill: {
        type: Date,
        required: true
    },
    createdAt: {
        type: Date,
        expires: 600, // Set the TTL to 300 seconds (5 minutes)
        default: Date.now
    }
})

const otpModal = mongoose.model('otp', OtpSchema)
const Otp = otpModal
export default Otp;