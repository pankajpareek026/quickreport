import Yup from "yup";

const assetValidator = Yup.object({
    name: Yup.string().required("Please enter asset / coin name "),
    coinId: Yup.string().required("Please select coin "),
    unit: Yup.number().typeError("invalid coin quantity").min(0.00000000, "quantity shuld be less then 0.00000000").required("Please enter quantity"),

})

export default assetValidator;