import { ApiRespose } from "../../utils/apiResponse.utils.js";
import { statusCode } from "../../utils/httpStatusCode.utils.js";


const editAssetFromAssetSpace = async (req, res, next) => {
    try {
        res.json(statusCode.ok).json(new ApiRespose())
    } catch (error) {
        next(error);
    }
}
export default editAssetFromAssetSpace 