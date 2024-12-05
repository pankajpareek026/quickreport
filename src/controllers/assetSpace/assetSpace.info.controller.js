import AssetSpace from "../../models/assetSpace.model.js";
import { ApiErrors } from "../../utils/apiErrors.utils.js";
import { ApiRespose } from "../../utils/apiResponse.utils.js";
import { statusCode } from "../../utils/httpStatusCode.utils.js";
import { Message } from "../../utils/responseMessage.utils.js";
import idSchema from "../../validators/id.validator.js";

const assetSpaceInfo = async (req, res, next) => {
    try {
        const { spaceId } = req.params;
        const { user } = req.auth;
        const { id } = await idSchema.validate({ id: spaceId });
        const assetSpaceDetails = await AssetSpace.findOne({
            owner: user, _id: id, status: true

        }, { __v: 0, owner: 0, updatedAt: 0 });

        if (!assetSpaceDetails) {
            return next(new ApiErrors(statusCode.notFound, Message.notFound))
        }

        res.status(statusCode.ok).json(new ApiRespose(true, Message.success, assetSpaceDetails))
    } catch (error) {
        next(error);
    }
}
export default assetSpaceInfo; 