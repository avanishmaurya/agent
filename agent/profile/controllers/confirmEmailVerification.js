const { resError400, resError401, resError599 } = require("../../../utils/resError")
const verifyOtp = require("../../utils/otp/validateOtp")
const updateAgentEmail = require("../dbmodels/updateAgentEmail")

module.exports = async (req, res) => {

    let agentUid = !(req.auth) ? '' : req.auth.agentUid
    if (!agentUid) {
        return res.status(401).json(resError401)
    }

    let rb = req.body
    if (!rb) {
        return res.status(400).json(resError400)
    }

    let {email, otp, otpToken } = rb

    if (!email || !otp || !otpToken) {
        return res.status(400).json(resError400)
    }

    let otpTokenPrev = ""

    /// OTP verification
    const { isVerified, uuid } = await verifyOtp(otp, otpToken, otpTokenPrev);
    if (!isVerified) {
        return res.status(401).json({
            success: false,
            message: "Invalid OTP",
        });
    }
    if (agentUid !== uuid) {
        return res.status(401).json(resError401);
    }

    try {
        
        const result = await updateAgentEmail(agentUid,email)

        if(result.success){
            return res.status(200).json({
                success:true,
                message:"Email verified successfully"
            })
        }else{
            return res.status(500).json({
                success:false,
                message:"Error while verifying the email"
            })
        }
    } catch (error) {
        console.log("error : ",error);
        return res.status(599).json(resError599)
    }
}