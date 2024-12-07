// to delele a perticular asset from asset space.
import AssetSpace from "../../models/assetSpace.model.js";
import { ApiRespose } from "../../utils/apiResponse.utils.js";
import { statusCode } from "../../utils/httpStatusCode.utils.js";
import { idSchema } from "../../validators/id.validator.js";
import Yup from "yup"

const deleteAssetFromAssetSpace = async (req, res, next) => {
    try {
        const { user } = req.auth;


        console.log("params =>", req.params)

        const validator = Yup.object().shape({
            assetId: idSchema,
            spaceId: idSchema
        }
        )

        const { spaceId, assetId } = await validator.validate(req.params);


        // check wether asset exists 

        const isAssetExist = await AssetSpace.findOne({
            $and: [{ _id: spaceId },
            { "assets._id": assetId }]
        })
        console.log("asset found =>", isAssetExist)

        if (!isAssetExist) {
            return res.status(statusCode.ok).json(
                new ApiRespose(false, "Asset not found !", null, null)
            )
        }

        let deleteResult = await AssetSpace.updateOne({
            owner: user,
            _id: spaceId,
            " assets._id": assetId
        }, {

            $pull: {
                assets: {
                    _id: assetId
                }
            }
        })
        deleteResult = deleteResult.toObject();

        res.json({
            deleteResult
        })

        // res.json(isAssetExist)
    } catch (error) {
        console.log("Error =>", error)
        next(error);
    }
}

export default deleteAssetFromAssetSpace 