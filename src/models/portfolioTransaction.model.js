import mongoose from 'mongoose';
// id INT AUTO_INCREMENT PRIMARY KEY,
//     time VARCHAR(50),
//     usd_pair VARCHAR(15),
//     original_pair VARCHAR(15),
//     original_price INT,
//     base VARCHAR(50),
//     price_in_usd INT,
//     order_type VARCHAR(10),  
//     coin_units VARCHAR(50),
//     buy_cost VARCHAR(50),
//     sell_cost VARCHAR(50),
//     user_id INT,
// comment VARCHAR(255),
// tag varchar(25),
const portfolioTransactionSchema = mongoose.Schema({
    time: {
        type: String,
        default: Date.now()

    },
    original_pair: {
        type: String,
        required: [true, "coin pair is required"]
    },
    usd_pair: {
        type: String,

    },
    base: {
        type: String,
        required: [true, "base is required"]
    }, transaction_type: {
        type: String,
        required: [true, "transaction Type is required"],
        enum: ['buy', 'sell',]
    },
    symbol: {
        type: String,
        required: [true, "symbol is required"]
    },
    original_price: {
        type: Number,
        required: [true, "original price is required"]
    },
    price_in_usd: {
        type: Number,
    },
    order_type: {
        type: String,
        required: [true, "order type is required"]
    },
    coin_units: {
        type: Number,
        required: [true, "coin units is required"]
    },
    original_buy_cost: {
        type: Number,
        required: [true, "buy cost is required"]
    },
    usd_buy_cost: {
        type: Number,
        required: [true, "buy cost is required"]
    },
    is_usd_pair: {
        type: Boolean,
        default: false
    },
    coin_id: {
        type: String,
        required: [true, "coinid is required"],
    },
    original_sell_cost: {
        type: Number,
        required: [true, "sell cost is required"],
        default: 0
    },
    usd_sell_cost: {
        type: Number,
        required: [true, "sell cost is required"],
        default: 0
    },
    tag: {
        type: String,
        default: "NA"
    },
    comment: {
        type: String,
        default: "NA"
    },
    portfolio: {
        type: String,
        default: "main"
    }
    ,
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

}, {
    timestamps: true
})

// const PortfolioTransactionModel = mongoose.model('tnx', portfolioTransactionSchema)


export default portfolioTransactionSchema;