import Yup from "yup";
const assetSpaceValidator = Yup.object({
    name: Yup.string().required("Please enter name"),
    locationType: Yup.string().oneOf(['exchange', 'wallet', 'stake', 'hardwareWallet', 'dex', 'NA']).required("Please select space location Exchange / Wallet"),
    address: Yup.string().default("NA")


})

export default assetSpaceValidator;