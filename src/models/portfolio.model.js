/*Portfolio:

- id (ObjectId)
- name (String)
- owner (ObjectId - reference to User)
- transactions (Array of ObjectIds - reference to Transaction)
- favorite (Array of ObjectIds - reference to User)
- track (Array of ObjectIds - reference to User)
*/


import mongoose from "mongoose";
// import { PortfolioTransaction } from "./portfolioTransaction.model.js";
import portfolioTransactionSchema from './portfolioTransaction.model.js';


const portfolioSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Portfolio Name is required"],
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
    transactions: [portfolioTransactionSchema]
}, {
    timestamps: true
})

const Portfolio = mongoose.model('Portfolio', portfolioSchema);

export default Portfolio 