import { Router } from "express";
import portfolio from "../controllers/portfolio/portfolio.show.controller.js";
import portfolioSearch from "../controllers/portfolio/portfolio.search.controller.js";
import cretePortfolio from "../controllers/portfolio/portfolio.create.controller.js";
import addPortfolioTransaction from "../controllers/portfolio/portfolio.addTransaction.controller.js";
import editTransactionFromFunding from "../controllers/finance/funding.editTransaction.controller.js";
import deleteTransactionFromPortfolio from "../controllers/portfolio/portfolio.deleteTransaction.controller.js";
import processUploadedFileInPortfolio from "../controllers/portfolio/portfolio.uploadFile.controller.js";
import fileUpload from "../middlewares/multer.middleware.js";
import transactionInfoFromPortfilio from './../controllers/portfolio/portfolio.transactionInfo.controller.js';

const router = Router();

// create new portfolio
router.post('/portfolio/new', cretePortfolio);


// portfolio info
router.get('/portfolio/:portfolioId/info', cretePortfolio);

// rename /edit portfolio
router.put('/portfolio/:portfolioId/rename', cretePortfolio);


// delete portfolio
router.patch('/portfolio/:portfolioId/delete', cretePortfolio);



// get all transactions from the portfolio 
router.get('/portfolios/:portfolioId', portfolio);

// search in portfolio
router.get('/portfolio/:portfolioId/search', portfolioSearch);



//to add new transaction in portfolio
router.post('/portfolio/:portfolioId/new', addPortfolioTransaction);

//upload transaction file and process transaction
router.post('/portfolio/:portfolioId/upload', fileUpload.single('transactionFile'), processUploadedFileInPortfolio)

// get transaction info by transaction id
router.get('/portfolio/:portfolioId/info/:trnsactionId', transactionInfoFromPortfilio);




// edit transaction from portfolio using transaction id 
router.put('/portfolio/:portfolioId/edit/:trnsactionId', editTransactionFromFunding);

// delete transaction from portfolio using transaction id
router.patch('/portfolio/:portfolioId/delete/:trnsactionId', deleteTransactionFromPortfolio);


export {
    router as portfolioRouter
}