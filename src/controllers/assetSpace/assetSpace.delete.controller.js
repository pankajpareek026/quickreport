import AssetSpace from "../../models/assetSpace.model.js";
import { ApiErrors } from "../../utils/apiErrors.utils.js";
import { ApiRespose } from "../../utils/apiResponse.utils.js";
import { statusCode } from "../../utils/httpStatusCode.utils.js";
import { Message } from "../../utils/responseMessage.utils.js";
import idSchema from "../../validators/id.validator.js";

const deleteAssetSpace = async (req, res, next) => {
    try {
        const { user } = req.auth
        console.log("user =>", user);
        const { spaceId } = req.params;
        const { id } = await idSchema.validate({ id: spaceId })

        const deleteResult = await AssetSpace.findOneAndUpdate({ _id: id, owner: user, status: true }, {
            status: false
        }, {
            includeResultMetadata: true,
            new: true
        })
        console.log("delte result =>", deleteResult)

        // in case any error while setting staus to false
        if (deleteResult?.value == null || !deleteResult) {
            return next(new ApiErrors(statusCode.badRequest, Message.unableToProcess));
        }
        res.status(statusCode.created).json(new ApiRespose(true, Message.deleted));

        console.log(deleteResult)
    } catch (error) {
        next(error);
    }
}
export default deleteAssetSpace;