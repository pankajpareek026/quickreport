const Transaction = require('../models/Transaction');
const Funding = require('../models/Funding');
const { getFundingBalance, getFundingHistory } = require('./fundingController');
const axios = require('axios');
const mongoose = require('mongoose');

// Get dashboard
const getDashboard = async (req, res) => {
  try {
    const userId = req.auth.UserId || req.auth.userId;
    const username = req.auth.User;

    if (!userId) {
      return res.redirect("/login");
    }

    // Get funding data
    const fundingResult = await getFundingHistory(userId);
    const balance = await getFundingBalance(userId);

    // Aggregate transactions by coin
    const userIdObj = typeof userId === 'string' ? new mongoose.Types.ObjectId(userId) : userId;
    const transactions = await Transaction.aggregate([
      { $match: { userId: userIdObj } },
      {
        $group: {
          _id: '$coinName',
          TU: { $sum: '$units' },
          TC: { $sum: '$totalCost' },
          SC: { $sum: '$sellCost' }
        }
      }
    ]);

    if (transactions.length === 0) {
      return res.render("dashbord", {
        results: [],
        Coins: [],
        invested: 0,
        Dpnl: [],
        Ppnl: [],
        Fbalance: [{ balance: balance || 0 }],
        fundingResult: fundingResult || [],
        Current_Value: 0,
        portValue: 0,
        chartContent: [],
        coinname: [],
        cv: 0,
        TotalSell: 0
      });
    }

    const coinname = [];
    const TotalCost = [];
    const SellCost = [];
    const TotalUnit = [];
    const Dpnl = [];
    const Ppnl = [];
    let invested = 0;
    let Current_Value = 0;
    let TotalSell = 0;
    const chartContent = [];

    transactions.forEach(result => {
      coinname.push(result._id.toUpperCase());
      TotalCost.push(result.TC);
      invested += parseFloat(result.TC - result.SC);
      SellCost.push(result.SC);
      TotalUnit.push(result.TU);
      TotalSell += parseFloat(result.SC);
      chartContent.push([`${result._id},${result.TC}`]);
    });

    // Get current prices from CoinGecko
    const ids = coinname.map(c => c.toLowerCase()).join(',');
    const url = `https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd`;

    let priceMap = {};
    try {
      const response = await axios.get(url, {
        headers: { 'Accept': 'application/json', 'User-Agent': 'QuickReport/1.0' },
        timeout: 10000
      });
      const data = response.data;
      coinname.forEach(coin => {
        const id = coin.toLowerCase();
        priceMap[coin] = data[id] ? data[id].usd : 0;
      });
    } catch (apiError) {
      console.error('CoinGecko Price Fetch Error:', apiError.message);
      // Fallback: set all prices to 0 if API fails
      coinname.forEach(coin => { priceMap[coin] = 0; });
    }

    // Calculate PnL for each coin
    coinname.forEach((coin, i) => {
      const price = priceMap[coin] || 0;
      let dpnlvalue, ppnlvalue;

      if (TotalUnit[i] > 0) {
        dpnlvalue = ((TotalUnit[i] * price) + SellCost[i]) - TotalCost[i];
        Current_Value += dpnlvalue;
        ppnlvalue = TotalCost[i] > 0
          ? ((((TotalUnit[i] * price) + SellCost[i]) - TotalCost[i]) / TotalCost[i]) * 100
          : 0;
      } else {
        dpnlvalue = SellCost[i] - TotalCost[i];
        Current_Value += dpnlvalue;
        ppnlvalue = TotalCost[i] > 0
          ? ((SellCost[i] - TotalCost[i]) / TotalCost[i]) * 100
          : 0;
      }

      Dpnl.push(parseFloat(dpnlvalue));
      Ppnl.push(parseFloat(ppnlvalue).toFixed(2));
    });

    const allAsset = [...new Set(coinname)];

    // Format results for view
    const results = transactions.map((tx, i) => ({
      Coin_Name: tx._id,
      TU: tx.TU,
      TC: tx.TC,
      SC: tx.SC
    }));

    res.render("dashbord", {
      results,
      Coins: allAsset,
      invested: parseFloat(invested).toFixed(3),
      Dpnl,
      Ppnl,
      Fbalance: [{ balance: balance || 0 }],
      fundingResult: fundingResult || [],
      Current_Value,
      portValue: parseFloat(invested) + parseFloat(Current_Value),
      chartContent,
      coinname,
      cv: 0,
      TotalSell
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    res.json({ Error: "Internal Server Error", message: error.message });
  }
};

// Reset all data
const resetAll = async (req, res) => {
  try {
    const userId = req.auth.UserId || req.auth.userId;

    if (!userId) {
      return res.redirect('/login');
    }

    await Promise.all([
      Transaction.deleteMany({ userId: userId }),
      Funding.deleteMany({ userId: userId })
    ]);

    res.redirect('/dash-bord');
  } catch (error) {
    console.error('Reset all error:', error);
    res.json({ Error: "Internal Server Error", message: error.message });
  }
};

module.exports = {
  getDashboard,
  resetAll
};

