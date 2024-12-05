import AssetSpace from "../../models/assetSpace.model.js";
import { ApiRespose } from "../../utils/apiResponse.utils.js";
import { statusCode } from "../../utils/httpStatusCode.utils.js";
import { Message } from "../../utils/responseMessage.utils.js";

const assetSpace = async (req, res, next) => {
    try {
        const { user } = req.auth;
        // to return all asset spaces 
        const assetSpaces = await AssetSpace.find({
            owner: user
        })
        console.log("asset spaces =>", assetSpaces)

        res.status(statusCode.ok).json(new ApiRespose(true, Message.success, assetSpaces))
    } catch (error) {
        next(error);
    }
}
export default assetSpace