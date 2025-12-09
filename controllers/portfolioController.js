const Transaction = require('../models/Transaction');
const User = require('../models/User');
const axios = require('axios');
const mongoose = require('mongoose');

// Get update transaction page
const getUpdateTransaction = async (req, res) => {
  try {
    const userId = req.auth.UserId || req.auth.userId;
    const transactionId = req.query.id;

    if (!userId || !transactionId) {
      return res.redirect('/login');
    }

    const transaction = await Transaction.findOne({
      _id: transactionId,
      userId: userId
    });

    if (!transaction) {
      return res.redirect('/dash-bord');
    }

    // Convert to format expected by view
    const result = [{
      ID: transaction._id,
      Coin_Name: transaction.coinName,
      ORDER_TYPE: transaction.orderType,
      PRICE: transaction.price,
      UNITS: transaction.units,
      TOTAL_COST: transaction.totalCost,
      SELL_COST: transaction.sellCost
    }];

    res.render('update', { result });
  } catch (error) {
    console.error('Get update transaction error:', error);
    res.redirect('/dash-bord');
  }
};

// Update transaction
const updateTransaction = async (req, res) => {
  try {
    const userId = req.auth.UserId || req.auth.userId;
    const { coinName, ordertype, id, price, units, totals } = req.body;

    if (!userId || !id) {
      return res.redirect('/login');
    }

    let sellcost;
    let finalPrice = parseFloat(price);
    let finalUnits = parseFloat(units);
    let finalTotal = parseFloat(totals);

    if (finalPrice < 0.0001) {
      finalPrice = parseFloat(finalPrice).toFixed(6);
    } else {
      finalPrice = parseFloat(finalPrice).toFixed(3);
    }

    if (finalTotal < 0.0001) {
      finalTotal = parseFloat(finalTotal).toFixed(6);
    } else {
      finalTotal = parseFloat(finalTotal).toFixed(2);
    }

    if (ordertype === "SELL") {
      finalUnits = 0 - finalUnits;
      sellcost = finalTotal;
      finalTotal = 0;
    } else {
      sellcost = 0;
    }

    await Transaction.findByIdAndUpdate(id, {
      coinName: coinName.toUpperCase(),
      orderType: ordertype.toUpperCase(),
      price: parseFloat(finalPrice),
      units: parseFloat(finalUnits),
      totalCost: parseFloat(finalTotal),
      sellCost: parseFloat(sellcost)
    }, {
      userId: userId
    });

    res.redirect(`/Transactions?Asset='${coinName}'`);
  } catch (error) {
    console.error('Update transaction error:', error);
    res.redirect('/dash-bord');
  }
};

// Get portfolio page
const getPortfolio = (req, res) => {
  const user = req.auth.User;
  if (user) {
    res.render("portfolio");
  } else {
    res.redirect('/login');
  }
};

// Add new transaction
const addTransaction = async (req, res) => {
  try {
    const userId = req.auth.UserId || req.auth.userId;
    const { coinName, ordertype, price, units, totals } = req.body;

    if (!userId) {
      return res.redirect('/login');
    }

    let sellcost;
    let finalPrice = parseFloat(price);
    let finalUnits = parseFloat(units);
    let finalTotal = parseFloat(totals);

    if (finalPrice < 0.0001) {
      finalPrice = parseFloat(finalPrice).toFixed(6);
    } else {
      finalPrice = parseFloat(finalPrice).toFixed(3);
    }

    if (finalTotal < 0.0001) {
      finalTotal = parseFloat(finalTotal).toFixed(6);
    } else {
      finalTotal = parseFloat(finalTotal).toFixed(2);
    }

    if (ordertype === "SELL") {
      finalUnits = 0 - finalUnits;
      sellcost = finalTotal;
      finalTotal = 0;
    } else {
      sellcost = 0;
    }

    await Transaction.create({
      userId: userId,
      coinName: coinName.toUpperCase(),
      orderType: ordertype.toUpperCase(),
      price: parseFloat(finalPrice),
      units: parseFloat(finalUnits),
      totalCost: parseFloat(finalTotal),
      sellCost: parseFloat(sellcost)
    });

    res.render("response");
  } catch (error) {
    console.error('Add transaction error:', error);
    res.json({ Error: error.message });
  }
};

// Get transaction details for a specific coin
const getTransactionDetails = async (req, res) => {
  try {
    const userId = req.auth.UserId || req.auth.userId;
    const assetName = req.query.Asset;

    if (!userId || !assetName) {
      return res.redirect('/dash-bord');
    }

    // Remove quotes from asset name if present
    const cleanAssetName = assetName.replace(/'/g, '');

    const transactions = await Transaction.find({
      userId: userId,
      coinName: cleanAssetName
    });

    if (transactions.length === 0) {
      return res.redirect('/dash-bord');
    }

    // Calculate aggregations
    const userIdObj = typeof userId === 'string' ? new mongoose.Types.ObjectId(userId) : userId;
    const aggregation = await Transaction.aggregate([
      { $match: { userId: userIdObj, coinName: cleanAssetName } },
      {
        $group: {
          _id: null,
          UnitTotal: { $sum: '$units' },
          CostTotal: { $sum: '$totalCost' }
        }
      }
    ]);

    const coinSymbol = cleanAssetName.substring(0, cleanAssetName.length - 5);
    let ImageSrc, CurrenPrice, ChangeIn24H, ChangeIn7D, ChangeIn30D, ChangeIn60D, ChangeIn90D;
    let Avp, CMCDATA, CoinId, CmcName, CmcSymbol, TotalPNLP;
    let volume = 0;
    let holding = 0;

    // Calculate holding and volume
    transactions.forEach(tx => {
      if (tx.units < 0) {
        volume += Math.abs(tx.units);
      } else {
        volume += tx.units;
      }
      holding += tx.units;
    });

    // Get CoinMarketCap data
    const cmcResponse = await axios.get(
      `https://pro-api.coinmarketcap.com/v2/cryptocurrency/quotes/latest?symbol=${coinSymbol}`,
      {
        headers: {
          "X-CMC_PRO_API_KEY": process.env.CMC_API_KEY || "8f4e31a4-7094-45aa-aa06-b9f748555a98",
          "Accept": "application/json",
        }
      }
    );

    CMCDATA = cmcResponse.data.data;
    CmcName = CMCDATA[coinSymbol][0].name;
    CmcSymbol = CMCDATA[coinSymbol][0].symbol;
    CurrenPrice = CMCDATA[coinSymbol][0]['quote']['USD'].price;
    ChangeIn24H = CMCDATA[coinSymbol][0]['quote']['USD'].percent_change_24h;
    ChangeIn7D = CMCDATA[coinSymbol][0]['quote']['USD'].percent_change_7d;
    ChangeIn30D = CMCDATA[coinSymbol][0]['quote']['USD'].percent_change_30d;
    ChangeIn60D = CMCDATA[coinSymbol][0]['quote']['USD'].percent_change_60d;
    ChangeIn90D = CMCDATA[coinSymbol][0]['quote']['USD'].percent_change_90d;

    CoinId = CMCDATA[coinSymbol][0].slug;

    // Handle special coin ID mappings
    const coinIdMap = {
      'polkadot-new': 'polkadot',
      'sxp': 'swipe',
      'bnb': 'binancecoin',
      'terra-luna-v2': 'terra-luna',
      'near-protocol': 'near',
      'polygon': 'matic-network',
      'travala': 'concierge-io',
      'pancakeswap': 'pancakeswap-token',
      'apecoin-ape': 'apecoin',
      'avalanche': 'avalanche-2'
    };

    CoinId = coinIdMap[CoinId] || CoinId;

    // Get CoinGecko data for image
    const geckoResponse = await axios.get(
      `https://api.coingecko.com/api/v3/coins/${CoinId}?localization=false&community_data=false&developer_data=false`
    );

    ImageSrc = geckoResponse.data.image.large;

    // Calculate average price
    if (aggregation.length > 0 && aggregation[0].UnitTotal !== 0) {
      Avp = aggregation[0].CostTotal / aggregation[0].UnitTotal;
    } else {
      Avp = 0;
    }

    // Calculate PnL
    if (Avp > 0) {
      TotalPNLP = ((CurrenPrice - Avp) / Avp) * 100;
    } else {
      TotalPNLP = 0;
    }

    // Format results for view
    const results = transactions.map(tx => ({
      ID: tx._id,
      Coin_Name: tx.coinName,
      ORDER_TYPE: tx.orderType,
      PRICE: tx.price,
      UNITS: tx.units,
      TOTAL_COST: tx.totalCost,
      SELL_COST: tx.sellCost
    }));

    res.render("Details", {
      results,
      holding,
      ImageSrc,
      CurrenPrice,
      FinalData: geckoResponse.data,
      CMCDATA,
      ChangeIn24H,
      ChangeIn30D,
      ChangeIn7D,
      ChangeIn60D,
      ChangeIn90D,
      Avp,
      CmcName,
      CmcSymbol,
      TotalPNLP,
      SumInvested: aggregation.length > 0 ? aggregation[0].CostTotal : 0,
      Asset_Name: cleanAssetName,
      volume
    });
  } catch (error) {
    console.error('Get transaction details error:', error);
    res.redirect('/dash-bord');
  }
};

// Delete transaction
const deleteTransaction = async (req, res) => {
  try {
    const userId = req.auth.UserId || req.auth.userId;
    const transactionId = req.query.id;
    const asset = req.query.Asset;

    if (!userId || !transactionId) {
      return res.redirect('/login');
    }

    await Transaction.findOneAndDelete({
      _id: transactionId,
      userId: userId
    });

    res.redirect(`/Transactions?Asset=${asset}`);
  } catch (error) {
    console.error('Delete transaction error:', error);
    res.json({ Error: "Internal Server Error", message: error.message });
  }
};

// Reset all transactions
const resetTransactions = async (req, res) => {
  try {
    const userId = req.auth.UserId || req.auth.userId;

    if (!userId) {
      return res.redirect('/login');
    }

    await Transaction.deleteMany({ userId: userId });
    res.redirect('/dash-bord');
  } catch (error) {
    console.error('Reset transactions error:', error);
    res.json({ Error: "Internal Server Error", message: error.message });
  }
};

module.exports = {
  getUpdateTransaction,
  updateTransaction,
  getPortfolio,
  addTransaction,
  getTransactionDetails,
  deleteTransaction,
  resetTransactions
};

