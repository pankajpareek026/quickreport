const Funding = require('../models/Funding');
const mongoose = require('mongoose');

// Get funding page
const getFunding = (req, res) => {
  const user = req.auth.User;
  if (user) {
    res.render("MainFunding");
  } else {
    res.redirect('/login');
  }
};

// Add funding transaction
const addFunding = async (req, res) => {
  try {
    const userId = req.auth.UserId || req.auth.userId;
    const { amount, type, Discription, date } = req.body;

    if (!userId) {
      return res.redirect('/login');
    }

    let finalAmount = parseFloat(amount);
    if (type === 'withdraw') {
      finalAmount = 0 - finalAmount;
    }

    await Funding.create({
      userId: userId,
      amount: finalAmount,
      type: type.toLowerCase(),
      description: Discription,
      date: new Date(date)
    });

    res.render('Fresponse');
  } catch (error) {
    console.error('Add funding error:', error);
    res.json({ Error: error.message });
  }
};

// Reset all funding
const resetFunding = async (req, res) => {
  try {
    const userId = req.auth.UserId || req.auth.userId;

    if (!userId) {
      return res.redirect('/login');
    }

    await Funding.deleteMany({ userId: userId });
    res.redirect('/dash-bord');
  } catch (error) {
    console.error('Reset funding error:', error);
    res.json({ Error: "Internal Server Error", message: error.message });
  }
};

// Get funding balance
const getFundingBalance = async (userId) => {
  try {
    const userIdObj = typeof userId === 'string' ? new mongoose.Types.ObjectId(userId) : userId;
    const result = await Funding.aggregate([
      { $match: { userId: userIdObj } },
      {
        $group: {
          _id: null,
          balance: { $sum: '$amount' }
        }
      }
    ]);

    return result.length > 0 ? result[0].balance : 0;
  } catch (error) {
    console.error('Get funding balance error:', error);
    return 0;
  }
};

// Get funding history
const getFundingHistory = async (userId) => {
  try {
    return await Funding.find({ userId: userId })
      .sort({ createdAt: -1 })
      .lean();
  } catch (error) {
    console.error('Get funding history error:', error);
    return [];
  }
};

module.exports = {
  getFunding,
  addFunding,
  resetFunding,
  getFundingBalance,
  getFundingHistory
};

