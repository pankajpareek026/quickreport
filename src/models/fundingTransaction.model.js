import mongoose from "mongoose";
import { type } from "os";
const fundingTransactionSchema = mongoose.Schema({
    amount: {
        type: Number,
        required: [true, "amount is required"]
    },
    currency: {
        type: String,
        required: [true, "currency is required"],
        default: "INR"
    },
    type: {
        type: String,
        enum: ["deposit", 'withdraw', 'airdrop', 'lost'],
        required: [true, " Transaction type is required"],

    },
    date: {
        type: Date,
        default: Date.now(),
    },
    note: {
        type: String,
        default: ""
        // required: [true, "note is required"]
    },
    tag: {
        type: String,
        default: ""
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: [true, "user id is required"],
        validate: {
            validator: async function (value) {
                const user = await mongoose.model('user').findOne({ _id: value });
                return !!user;
            },
            message: 'Invalid user id',
        },
    },
    _id: {
        type: mongoose.Schema.Types.ObjectId,
        default: new mongoose.Types.ObjectId()
    }
}, { timeStamp: true })

// const FundingTransactionModle = mongoose.model("funding", fundingTransactionSchema);

// export { FundingTransactionModle as FundingTrasaction }
export default fundingTransactionSchema;