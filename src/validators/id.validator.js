import Yup from "yup";
import mongoose from "mongoose";
const idValidator = Yup.object({
    id: Yup.string().test('validate-objectId', 'Invalid request ', (value) => {
        return mongoose.Types.ObjectId.isValid(`${value}`)
    }).required('invalid request '),
})

const idSchema = Yup.string().test('validate-objectId', 'Invalid request ', (value) => {
    return mongoose.Types.ObjectId.isValid(`${value}`)
}).required('invalid request ');
export { idSchema };

export default idValidator;