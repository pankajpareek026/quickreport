import Yup from 'yup';
import { idSchema } from "../../validators/id.validator.js";
import AssetSpace from "../../models/assetSpace.model.js";
import { ApiErrors } from '../../utils/apiErrors.utils.js';
import { statusCode } from '../../utils/httpStatusCode.utils.js';
import { Message } from '../../utils/responseMessage.utils.js';
import { ApiRespose } from '../../utils/apiResponse.utils.js';
import { log } from 'console';
import mongoose from 'mongoose';

// to assset details 
const assetInfoFromAssetSpace = async (req, res, next) => {
    try {

        const { params } = req;
        console.log("params =>", params)
        const { user } = req.auth;
        console.log("user =>", user)
        const assetInfoSchema = Yup.object().shape({
            spaceId: idSchema,
            assetId: idSchema
        })

        const { spaceId, assetId } = await assetInfoSchema.validate(params);

        // find out the asset details
        let assetDetails = await AssetSpace.findOne({

            $and: [
                { _id: spaceId },
                { owner: user },
                { assets: { $elemMatch: { _id: assetId } } }
            ]

        }, { "assets.$": 1 })
        log("asset details =>", assetDetails)
        if (!assetDetails) {
            return next(new ApiErrors(statusCode.notFound, "Asset " + Message.notFound, null, true))
        }
        const asssetSpaceId = assetDetails?._id
        // assetDetails=assetDetails[0]
        // const finalData={...assetDetails,spaceId:asssetSpaceId,

        // }
        // console.log("final data =>",finalData)


        res.status(statusCode.ok).json(new ApiRespose(true, Message.success, { ...assetDetails.assets[0].toJSON(), asssetSpaceId }, null))
        // get asset 

    } catch (error) {
        console.error("Error =>", error)
        next(error);
    }
}
export default assetInfoFromAssetSpace; 