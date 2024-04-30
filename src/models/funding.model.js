/* Funding::::::::::::::::::::::
- id (ObjectId)
- amount (Number)
- type (String) // e.g., investment, donation, etc.
- date (Date)
- user (ObjectId - reference to User)
- transactions (Array of ObjectIds - reference to Transaction)


*/

import mongoose from 'mongoose';
import fundingTransactionSchema from './fundingTransaction.model.js';

// fundingTransactionSchema
const fundingSchema = mongoose.Schema({
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        validator: async function (value) {
            const user = await mongoose.model('user').findOne({ _id: value });
            return !!user;
        }
    },
    transactions: [fundingTransactionSchema]
}, {
    timestamps: true
})

const Funding = mongoose.model('funding', fundingSchema)

export default Funding 
