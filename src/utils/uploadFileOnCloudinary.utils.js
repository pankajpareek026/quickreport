// const cloudinary = require('./cloudinary.utils.js');
import { cloudinary } from "./cloudinary.utils";
/**
 * 
 * {
    "asset_id": "3c0a407da4aba18b2ff82baa86296fb9",
    "public_id": "miazbwdpxwdv0ndje72a.csv",
    "version": 1704725183,
    "version_id": "b1e7f3dcc778e36fb98791a8ab325ab5",
    "signature": "d19f3507f83cb9879a802574206c1b5290fd3d3b",
    "resource_type": "raw",
    "created_at": "2024-01-08T14:46:23Z",
    "tags": [],
    "bytes": 2644,
    "type": "upload",
    "etag": "fbdb9a7407fdb63f9bf6ae9382a91f91",
    "placeholder": false,
    "url": "http://res.cloudinary.com/dtzpsj9ob/raw/upload/v1704725183/miazbwdpxwdv0ndje72a.csv",
    "secure_url": "https://res.cloudinary.com/dtzpsj9ob/raw/upload/v1704725183/miazbwdpxwdv0ndje72a.csv",
    "folder": "",
    "original_filename": "test",
    "api_key": "354156859462652"
}
 */

const uploadOnCloudinary = async (file) => {
    try {
        const cloudnaryUploadResult = await cloudinary.uploader.upload(file, { resource_type: "raw" })
        // console.log(cloudnaryUploadResult)
        return cloudnaryUploadResult;
    } catch (error) {
        let message = error.message;

        if (error.message == 'Empty file')
            message = "empty file , please try again"
        console.log(error)
        return {
            error: true,
            message
        }
    }


}

export default uploadOnCloudinary;