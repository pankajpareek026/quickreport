import Yup from "yup";
import mongoose from "mongoose";
const idSchema = Yup.object({
    id: Yup.string().test('validate-objectId', 'Invalid request ', (value) => {
        return mongoose.Types.ObjectId.isValid(`${value}`)
    }).required('invalid request '),
})

export default idSchema;