import { ApiRespose } from "../../utils/apiResponse.utils.js";
import { statusCode } from "../../utils/httpStatusCode.utils.js";

const SearchInassetSpace = async (req, res, next) => {
    try {
        console.log("AssetSpace")
        res.status(statusCode.ok).json(new ApiRespose(true, "asset space search"))
    } catch (error) {
        next(error);
    }
}
export default SearchInassetSpace