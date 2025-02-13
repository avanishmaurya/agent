const { resError401, resError400, resError599 } = require("../../../utils/resError")
const addAgentBankDetails = require("../dbmodels/addAgentBankDetails")
const verifyOtp = require("../../utils/otp/validateOtp")

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

        const result = await addAgentBankDetails(bankDetails)

        if (result.success) {
            return res.status(200).json({
                success: true,
                message: "Bank details added successfully"
            })
        } else {
            return res.status(500).json({
                success: false,
                message: "Error while adding bank details"
            })
        }
    } catch (error) {
        console.log("error : ", error);
        return res.status(599).json(resError599)
    }
}