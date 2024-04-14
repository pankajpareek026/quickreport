/* Funding::::::::::::::::::::::
- id (ObjectId)
- amount (Number)
- type (String) // e.g., investment, donation, etc.
- date (Date)
- user (ObjectId - reference to User)
- transactions (Array of ObjectIds - reference to Transaction)


*/

import mongoose from 'mongoose';
import { FundingTrasaction } from './fundingTransaction.model';
const fundingSchema =  mongoose.Schema({
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        validator: async function (value) {
            const user = await Mongoose.model('user').findOne({ _id: value });
            return !!user;
        }
    },
    transactions: [FundingTrasaction]
}, {
    timestamps: true
})

const Funding = mongoose.model('funding', fundingSchema)

export { Funding }
