const { resError401, resError599 } = require("../../../utils/resError")
const sendMobileOtp = require("../../utils/otp/sendMobileOtp")

module.exports = async (req, res) => {

    let agentUid = !(req.auth) ? '' : req.auth.agentUid
    let agentId = !(req.auth) ? '' : req.auth.agentId
    if (!agentUid || !agentId) {
        return res.status(401).json(resError401)
    }

    try {

        let sendOtp = await sendMobileOtp(agentId,agentUid)

        if (sendOtp.success) {
            return res.status(200).json({
                success: true,
                data: sendOtp.data,
                otpSent: true,
                otpToken: sendOtp.data.otpToken,
            });
        } else {
            return res.status(500).json({
                success: false,
                otpSent: false,
                message: "Error sending OTP",
            });
        }
        
    } catch (error) {
        console.log("error : ",error);
        return res.status(599).json(resError599)
    }
}