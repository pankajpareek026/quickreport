// to update asset space /rename asset Space
import AssetSpace from "../../models/assetSpace.model.js";
import { ApiErrors } from "../../utils/apiErrors.utils.js";
import { ApiRespose } from "../../utils/apiResponse.utils.js";
import { statusCode } from "../../utils/httpStatusCode.utils.js";
import { Message } from "../../utils/responseMessage.utils.js";
import { idSchema, assetSpaceSchema } from './../../validators/index.validators.js';



const renameAssetSpace = async (req, res, next) => {
    try {
        const { user } = req.auth;

        const { spaceId } = req.params;
        const updateSpaceSchema = assetSpaceSchema.concat(idSchema);
        const { name, locationType, address } = await updateSpaceSchema.validate({ ...req.body, id: spaceId, owner: user });

        const updateResult = await AssetSpace.findOneAndUpdate({ _id: spaceId },
            {
                name,
                spaceInfo: {
                    locationType,
                    address
                }
            },
            { includeResultMetadata: true, new: true }
        )

        console.log("update result =>", updateResult);


        // in case any error while updating asset space
        if (!updateResult.value) {
            return next(new ApiErrors(statusCode.badRequest, Message.unableToProcess));
        }
        res.status(statusCode.created).json(new ApiRespose(true, Message.updated));

    } catch (error) {
        next(error);
    }
}
export default renameAssetSpace 