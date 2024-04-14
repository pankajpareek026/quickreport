import { Router } from "express";
import funding from "../controllers/finance/funding.show.controller.js";
import addFundingTransaction from "../controllers/finance/funding.addTransaction.controller.js";
import editTransactionFromFunding from "../controllers/finance/funding.editTransaction.controller.js";
import deleteTransactionFromFunding from "../controllers/finance/funding.deleteTransaction.controller.js";
import fundingSearch from "../controllers/finance/funding.search.controller.js";
import transactionInfoFromFunding from "../controllers/finance/funding.transactionInfo.controller.js";
import fundingPaggination from './../controllers/finance/funding.pagination.controller.js';
import auth from "../middlewares/auth.middleware.js";



const router = Router();
// to get all data related to funding page
router.get('/funding',auth, funding)

// search tansaction in funding page [?query=value]
router.get('/funding/search',auth, fundingSearch)


// add funding transaction
router.post('/funding/new',auth, addFundingTransaction)



// get detail of a funding transaction
router.get('/funding/info/:transactionId',auth, transactionInfoFromFunding)

// paggination 
router.get('/funding/:start/:end',auth, fundingPaggination)


// edit funding transaction
router.put('/funding/edit/:transactionId',auth, editTransactionFromFunding)


// delete funding transaction
router.patch('/funding/delete/:transactionId',auth, deleteTransactionFromFunding)


export {
    router as financeRouter
}