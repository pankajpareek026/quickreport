import { ApiRespose } from "../../utils/apiResponse.utils.js";
import { statusCode } from "../../utils/httpStatusCode.utils.js";

const assetSpace = async (req, res, next) => {
    try {
        console.log("AssetSpace")
        res.status(statusCode.ok).json(new ApiRespose())
    } catch (error) {
        next(error);
    }
}
export default assetSpace