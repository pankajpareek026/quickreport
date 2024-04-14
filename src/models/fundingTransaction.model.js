import mongoose from "mongoose";
const fundingTransactionSchema = mongoose.Schema({
    amount: {
        type: Number,
        required: [true, "amount is required"]
    },
    currency: {
        type: String,
        required: [true, "currency is required"]
    },
    type: {
        type: String,
        required: [true, "type is required"]
    },
    note: {
        type: String,
        required: [true, "note is required"]
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
}, { timeStamp: true })

const FundingTransactionModle = mongoose.model("funding", fundingTransactionSchema);

export { FundingTransactionModle as FundingTrasaction }