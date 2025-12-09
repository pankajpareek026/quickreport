const Transaction = require('../models/Transaction');
const csvtojson = require('csvtojson');
const { uploadToCloudinary, getFileFromCloudinary, deleteFromCloudinary } = require('../config/cloudinary');

// Get upload page
const getUpload = (req, res) => {
  const user = req.auth.User;
  if (!user) {
    res.redirect('/login');
  } else {
    res.render("uploadFile");
  }
};

// Process uploaded file
const processUpload = async (req, res) => {
  try {
    const userId = req.auth.UserId || req.auth.userId;

    if (!req.files || !userId) {
      return res.render('error', { message: 'No file uploaded' });
    }

    const file = req.files.Tfile;
    const fileName = file.name;
    const fileExtension = fileName.toLowerCase().split('.').pop();

    // Validate file type
    if (fileExtension !== 'json' && fileExtension !== 'csv') {
      return res.render('error', { message: 'Unsupported file type. Please upload JSON or CSV files only.' });
    }

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      return res.render('error', { message: 'File size exceeds 10MB limit' });
    }

    // Upload to Cloudinary
    let cloudinaryResult;
    try {
      cloudinaryResult = await uploadToCloudinary(
        file.data,
        fileName,
        `quickreport/uploads/${userId}`
      );
    } catch (cloudinaryError) {
      console.error('Cloudinary upload error:', cloudinaryError);
      return res.render('error', { message: 'Failed to upload file to cloud storage' });
    }

    // Process file based on extension
    try {
      if (fileExtension === 'json') {
        await processJSONFile(cloudinaryResult.public_id, userId, fileName, res);
      } else if (fileExtension === 'csv') {
        await processCSVFile(cloudinaryResult.public_id, userId, fileName, res);
      }

      // Optionally delete from Cloudinary after processing (or keep for audit)
      // Uncomment the line below if you want to delete files after processing
      // await deleteFromCloudinary(cloudinaryResult.public_id);
    } catch (processError) {
      // If processing fails, delete the uploaded file from Cloudinary
      try {
        await deleteFromCloudinary(cloudinaryResult.public_id);
      } catch (deleteError) {
        console.error('Error cleaning up Cloudinary file:', deleteError);
      }
      throw processError;
    }
  } catch (error) {
    console.error('Upload error:', error);
    res.render('error', { message: 'Upload failed: ' + error.message });
  }
};

// Process JSON file (Binance format)
const processJSONFile = async (cloudinaryPublicId, userId, fileName, res) => {
  try {
    // Get file content from Cloudinary
    const fileContent = await getFileFromCloudinary(cloudinaryPublicId);
    const dataArray = JSON.parse(fileContent);

    if (!Array.isArray(dataArray)) {
      throw new Error('Invalid JSON format: Expected an array');
    }

    const transactions = [];

    for (const item of dataArray) {
      // Validate required fields
      if (!item.Market || !item.Type || !item.Price || !item.Amount || !item.Total) {
        console.warn('Skipping invalid transaction:', item);
        continue;
      }

      const coinName = item.Market;
      const orderType = item.Type;
      let price = parseFloat(item.Price);
      let units = parseFloat(item.Amount);
      const tradeCost = parseFloat(item.Total);
      let totalCost, sellCost;

      // Validate numeric values
      if (isNaN(price) || isNaN(units) || isNaN(tradeCost)) {
        console.warn('Skipping transaction with invalid numbers:', item);
        continue;
      }

      if (orderType === "SELL") {
        sellCost = tradeCost;
        totalCost = 0;
        units = 0 - units;
      } else {
        sellCost = 0;
        totalCost = tradeCost;
      }

      transactions.push({
        userId: userId,
        coinName: coinName.toUpperCase(),
        orderType: orderType.toUpperCase(),
        price: price,
        units: units,
        totalCost: totalCost,
        sellCost: sellCost
      });
    }

    if (transactions.length === 0) {
      throw new Error('No valid transactions found in the file');
    }

    // Insert transactions in batches to avoid overwhelming the database
    const batchSize = 100;
    for (let i = 0; i < transactions.length; i += batchSize) {
      const batch = transactions.slice(i, i + batchSize);
      await Transaction.insertMany(batch);
    }

    res.render('uploadresponse', {
      transactions: transactions.length,
      file: fileName
    });
  } catch (error) {
    console.error('JSON processing error:', error);
    res.render('error', { message: 'Failed to process JSON file: ' + error.message });
  }
};

// Process CSV file (KuCoin format)
const processCSVFile = async (cloudinaryPublicId, userId, fileName, res) => {
  try {
    // Get file content from Cloudinary
    const fileContent = await getFileFromCloudinary(cloudinaryPublicId);

    // Convert CSV string to JSON
    const jsonData = await csvtojson().fromString(fileContent);

    if (!Array.isArray(jsonData) || jsonData.length === 0) {
      throw new Error('Invalid CSV format or empty file');
    }

    const excludedSymbols = [
      "POLX-USDT", "ARNM-USDT", "WOOP-USDT", "USDT-USDC", "USDC-USDT",
      "OXT-USDT", "ARMN-USDT", "MLS-USDT", "AFK-USDT", "KCS-USDT",
      "VR-USDT", "ONSTON-USDT", "GMM-USDT", "XCN-USDT", "WAXP-USDT",
      "RSR-USDT", "GALAX-USDT", "BLOK-USDT", "EWT-USDT", "CTSI-USDT",
      "CWEB-USDT", "KDA-USDT", "UTK-USDT", "WAX-USDT", "MOVR-USDT", "VIDT-USDT"
    ];

    const transactions = [];

    for (const object of jsonData) {
      // Validate required fields
      if (!object.symbol || !object.side || !object.price || !object.size || !object.dealFunds) {
        console.warn('Skipping invalid CSV row:', object);
        continue;
      }

      let symbol = object.symbol;

      if (excludedSymbols.includes(symbol)) {
        continue;
      }

      if (symbol.match(/-USDT|-USDC/g)) {
        symbol = symbol.replace("-", "");
        if (symbol.includes("USDC")) {
          symbol = symbol.replace("USDC", "USDT");
        }
      }

      const assetPrice = parseFloat(object.price);
      let filledUnits = parseFloat(object.size);
      const orderside = object.side.toLowerCase();
      let buycost = parseFloat(object.dealFunds);
      let sellcost = 0;

      // Validate numeric values
      if (isNaN(assetPrice) || isNaN(filledUnits) || isNaN(buycost)) {
        console.warn('Skipping CSV row with invalid numbers:', object);
        continue;
      }

      if (orderside === "sell") {
        sellcost = buycost;
        buycost = 0;
        filledUnits = 0 - filledUnits;
      }

      transactions.push({
        userId: userId,
        coinName: symbol.toUpperCase(),
        orderType: orderside.toUpperCase(),
        price: assetPrice,
        units: filledUnits,
        totalCost: buycost,
        sellCost: sellcost
      });
    }

    if (transactions.length === 0) {
      throw new Error('No valid transactions found in the CSV file');
    }

    // Insert transactions in batches
    const batchSize = 100;
    for (let i = 0; i < transactions.length; i += batchSize) {
      const batch = transactions.slice(i, i + batchSize);
      await Transaction.insertMany(batch);
    }

    res.render(__dirname + "/views/uploadresponse", {
      transactions: transactions.length,
      file: fileName
    });
  } catch (error) {
    console.error('CSV processing error:', error);
    res.render('error', { message: 'Failed to process CSV file: ' + error.message });
  }
};

module.exports = {
  getUpload,
  processUpload
};
