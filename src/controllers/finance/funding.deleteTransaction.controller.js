import FundingModal from "../../models/funding.model.js";
import { ApiErrors } from "../../utils/apiErrors.utils.js";
import { ApiRespose } from "../../utils/apiResponse.utils.js";
import { statusCode } from "../../utils/httpStatusCode.utils.js";
import { Message } from "../../utils/responseMessage.utils.js";

const deleteTransactionFromFunding = async (req, res, next) => {
    try {
        // extract user id from request
        const { user: userId } = req.auth

        // extract transactionId from params
        const { transactionId } = req.params


        //delete transaction using transaction id
        const deleteResult = await FundingModal.updateOne({ owner: userId }, {
            $pull: { "transactions": { _id: transactionId } }
        })


        // if any error while delete transaction 
        if (!deleteResult.deletedCount == 1) {
            return next(new ApiErrors(statusCode.badRequest, Message.wentWrong))
        }
        console.log("delete Result =>", deleteResult)


        // return success message assumes tha  transaction id deleted successfully
        return res.status(statusCode.ok).json(new ApiRespose(true, Message.trnsDeleted))


    } catch (error) {
        return next(error);
    }
}

export default deleteTransactionFromFunding
