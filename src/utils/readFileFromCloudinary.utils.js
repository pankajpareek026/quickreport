import axios from 'axios';
import { cloudinary } from './cloudinary.utils.js';
const readFileFromCloudinary = async (fileUri) => {
    try {
        let fileResult = await axios(fileUri)
        fileResult = await fileResult.data
        // cloudinaryUrl = await cloudinaryUrl

        // console.log(fileResut.data)
        return fileResult
    } catch (error) {
        // console.log(error)
        return {
            error: true,
            message: error
        }
    }
}
// console.log(readFileFromCloudinary("https://res.cloudinary.com/dtzpsj9ob/raw/upload/v1704725183/mibzbwdpxwdv0ndje72a.csv"))
// console.log(readFileFromCloudinary("iqxv4sfeonbawitucjr4.csv")); console
export default readFileFromCloudinary;