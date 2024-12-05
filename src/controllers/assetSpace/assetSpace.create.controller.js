import AssetSpace from "../../models/assetSpace.model.js";
import { ApiErrors } from "../../utils/apiErrors.utils.js";
import { ApiRespose } from "../../utils/apiResponse.utils.js";
import { statusCode } from "../../utils/httpStatusCode.utils.js";
import { isWalletAddress } from "../../utils/web3.utils.js";
import { assetSpaceValidator } from "../../validators/index.validators.js";



const createAssetSpace = async (req, res, next) => {
    try {
        const { user } = req.auth;

        console.log(req.auth);
        const { name, locationType, address } = await assetSpaceValidator.validate(req.body);
        // res.status(statusCode.ok).json(new ApiRespose(true, 'createAssetSpace'));
        // if wallet address is provided then check is it valid wallet address
        if (address !== "NA") {
            const { is } = isWalletAddress(address);
            if (!is) {
                next(new ApiErrors(statusCode.validationError, "Invalid wallet address",))
            }
        }

        // check wether asset space already exists
        const isExists = await AssetSpace.findOne({ owner: user, name });
        if (isExists) {
            // return res.status(statusCode.created).json(new ApiErrors(false, `Asset space " ${name} " already exists !`))
            return next(new ApiErrors(statusCode.alreadyExists, `Asset space ' ${name} ' already exists !`, null, false))

        }

        // create a asset space
        const createResult = AssetSpace.create({
            owner: user,
            name,
            spaceInfo: {
                locationType,
                address
            }

        })
        if (createResult) {
            return res.status(statusCode.created).json(new ApiRespose(true, `Asset space ${name} created succesfully`))
        }

    } catch (error) {
        next(error);
    }
}
export default createAssetSpace; 