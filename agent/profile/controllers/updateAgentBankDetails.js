const { resError401, resError400, resError500, resError599 } = require("../../../utils/resError")
const verifyOtp = require("../../utils/otp/validateOtp")
const updateAgentBankDetails = require("../dbmodels/updateAgentBankDetails")

module.exports = async (req, res) => {

    let agentUid = !(req.auth) ? '' : req.auth.agentUid
    let agentId = !(req.auth) ? '' : req.auth.agentId
    if (!agentUid || !agentId) {
        return res.status(401).json(resError401)
    }

    let rb = req.body
    if (!rb) {
        return res.status(400).json(resError400)
    }

    let { accountHolderName, accountNumber, ifscCode, branchName, bankName, otp, otpToken } = rb

    if (!accountHolderName || !accountNumber || !ifscCode || !branchName || !bankName || !otp || !otpToken) {
        return res.status(400).json(resError400)
    }

    /// OTP verification
    const { isVerified, uuid } = await verifyOtp(otp, otpToken);
    if (!isVerified) {
        return res.status(401).json({
            success: false,
            message: "Invalid OTP",
        });
    }
    if (agentUid !== uuid) {
        return res.status(401).json(resError401);
    }

    const bankDetails = {
        agentId,
        accountHolderName,
        accountNumber,
        ifscCode,
        branchName,
        bankName
    }

    try {
        
        const updateBankDetails = await updateAgentBankDetails(bankDetails)

        if(updateBankDetails.success){
            return res.status(200).json({
                success:true,
                message:"Bank details updated successfully"
            })
        }else{
            return res.status(500).json(resError500)
        }

    } catch (error) {
        console.log("error : ",error);
        res.status(599).json(resError599)
        
    }
}