/*Portfolio:

- id (ObjectId)
- name (String)
- owner (ObjectId - reference to User)
- transactions (Array of ObjectIds - reference to Transaction)
- favorite (Array of ObjectIds - reference to User)
- track (Array of ObjectIds - reference to User)
*/

import { ref } from "joi";
import mongoose from "mongoose";
import { PortfolioTransaction } from "./portfolioTransaction.model";

const portfolioSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Portfolio Name is required"],
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: [true, "user id is required"],
        validate: {
            validator: async function (value) {
                const user = await Mongoose.model('user').findOne({ _id: value });
                return !!user;
            },
            message: 'Invalid user id',
        },
    },
    transactions: [PortfolioTransaction]
}, {
    timestamps: true
})

const Portfolio = mongoose.modal('Portfolio', portfolioSchema);

export default Portfolio 