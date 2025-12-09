const express = require('express');
const router = express.Router();
const Authentication = require('../middleware/auth');
const { validateCoinName } = require('../middleware/validation');
const {
  getUpdateTransaction,
  updateTransaction,
  getPortfolio,
  addTransaction,
  getTransactionDetails,
  deleteTransaction,
  resetTransactions
} = require('../controllers/portfolioController');

// All routes require authentication
router.use(Authentication);

router.get('/update', getUpdateTransaction);
router.post('/update', updateTransaction);
router.get('/portfolio', getPortfolio);
router.post('/portfolio', addTransaction);
router.get('/Transactions', validateCoinName, getTransactionDetails);
router.get('/delete', deleteTransaction);
router.get('/reset', resetTransactions);

module.exports = router;

