import { Router } from "express";
import funding from "../controllers/finance/funding.show.controller.js";
import addFundingTransaction from "../controllers/finance/funding.addTransaction.controller.js";
import editTransactionFromFunding from "../controllers/finance/funding.editTransaction.controller.js";
import deleteTransactionFromFunding from "../controllers/finance/funding.deleteTransaction.controller.js";
import fundingSearch from "../controllers/finance/funding.search.controller.js";
import transactionInfoFromFunding from "../controllers/finance/funding.transactionInfo.controller.js";
import fundingPaggination from './../controllers/finance/funding.pagination.controller.js';



const router = Router();
// to get all data related to funding page
router.get('/funding', funding)

// search tansaction in funding page [?query=value]
router.get('/funding/search', fundingSearch)


// add funding transaction
router.post('/funding/new', addFundingTransaction)



// get detail of a funding transaction
router.get('/funding/info/:transactionId', transactionInfoFromFunding)

// paggination 
router.get('/funding/:start/:end', fundingPaggination)


// edit funding transaction
router.put('/funding/edit/:transactionId', editTransactionFromFunding)


// delete funding transaction
router.patch('/funding/delete/:transactionId', deleteTransactionFromFunding)


export {
    router as financeRouter
}