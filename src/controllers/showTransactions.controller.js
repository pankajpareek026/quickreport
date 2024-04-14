const ApiErrors = require("../../utils/apiErrors.utils")

const showAllTransactions=async(req,res,next)=>{
const {coinId}=req.params
if(!coinId)
{
    return next(new ApiErrors());


}




}

module.exports=showAllTransactions