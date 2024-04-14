// to delele a perticular asset from asset space.
import { ApiRespose } from "../../utils/apiResponse.utils.js";
import { statusCode } from "../../utils/httpStatusCode.utils.js";


const deleteAssetFromAssetSpace = async (req, res, next) => {
    try {
        res.json(statusCode.ok).json(new ApiRespose())
    } catch (error) {
        next(error);
    }
}

export default deleteAssetFromAssetSpace 