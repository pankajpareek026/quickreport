import AssetSpace from "../../models/assetSpace.model.js";
import { ApiErrors } from "../../utils/apiErrors.utils.js";
import { ApiRespose } from "../../utils/apiResponse.utils.js";
import { statusCode } from "../../utils/httpStatusCode.utils.js";
import { Message } from "../../utils/responseMessage.utils.js";
import assetValidator from "../../validators/asset.validator.js";


const addAssetToAssetSpace = async (req, res, next) => {
    try {
        const { spaceId } = req.params;
        const { user } = req.auth;
        const { name, coinId, unit } = await assetValidator.validate(req.body);

        const isSpceExists = await AssetSpace.findOne({ _id: spaceId });
        if (!isSpceExists) {
            return next(new ApiErrors(statusCode.badRequest, Message.unableToProcess))
        }

        const addAsset = await AssetSpace.updateOne({ _id: spaceId, owner: user }, {
            $push: {
                assets: {
                    unit,
                    name,
                    coinId,
                }
            }
        })
        // if asset added successfully 
        if (!addAsset?.modifiedCount) {
            return next(new ApiErrors(statusCode.internalServerError, Message.internalError, true))
        }

        res.status(statusCode.created).json(new ApiRespose(true, "Asset added successfully !!"))

    } catch (error) {
        next(error);
    }
}
export default addAssetToAssetSpace;