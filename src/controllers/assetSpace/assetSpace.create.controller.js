import { ApiRespose } from "../../utils/apiResponse.utils.js";
import { statusCode } from "../../utils/httpStatusCode.utils.js";

const createAssetSpace = async (req, res, next) => {
    try {
        res.status(statusCode.ok).json(new ApiRespose(true, 'createAssetSpace'))
    } catch (error) {
        next(error);
    }
}
export default createAssetSpace; 