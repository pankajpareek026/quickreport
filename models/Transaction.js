const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required'],
    index: true
  },
  coinName: {
    type: String,
    required: [true, 'Coin name is required'],
    trim: true,
    uppercase: true,
    maxlength: [20, 'Coin name cannot exceed 20 characters']
  },
  orderType: {
    type: String,
    required: [true, 'Order type is required'],
    enum: {
      values: ['BUY', 'SELL'],
      message: 'Order type must be either BUY or SELL'
    }
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative']
  },
  units: {
    type: Number,
    required: [true, 'Units are required']
  },
  totalCost: {
    type: Number,
    required: true,
    default: 0,
    min: [0, 'Total cost cannot be negative']
  },
  sellCost: {
    type: Number,
    required: true,
    default: 0,
    min: [0, 'Sell cost cannot be negative']
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Compound index for efficient queries
transactionSchema.index({ userId: 1, coinName: 1 });
transactionSchema.index({ userId: 1, createdAt: -1 });

const Transaction = mongoose.model('Transaction', transactionSchema);

module.exports = Transaction;

