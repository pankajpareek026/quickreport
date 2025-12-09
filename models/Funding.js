const mongoose = require('mongoose');

const fundingSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required'],
    index: true
  },
  amount: {
    type: Number,
    required: [true, 'Amount is required']
  },
  type: {
    type: String,
    required: [true, 'Type is required'],
    enum: {
      values: ['deposit', 'withdraw'],
      message: 'Type must be either deposit or withdraw'
    }
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  date: {
    type: Date,
    required: [true, 'Date is required']
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for efficient queries
fundingSchema.index({ userId: 1, createdAt: -1 });
fundingSchema.index({ userId: 1, date: -1 });

const Funding = mongoose.model('Funding', fundingSchema);

module.exports = Funding;

