const { resError400, resError599 } = require("../../../utils/resError")
const sendMobileOtp = require("../utils/otp/sendMobileOtp");

module.exports = async (req, res) => {
    let rb = req.body;
    if (!rb) {
        return res.status(400).json(resError400);
    }

    let { agentUid, agentId, count } = rb;

    if (!agentUid || !agentId || !count) {
        return res.status(400).json(resError400);
    }

    count = parseInt(count);

    if (count > 1) {
        return res.status(400).json(resError400);
    }

    try {
        const sendOtp = await sendMobileOtp(agentId, agentUid);

        if (sendOtp.success) {
            return res.status(200).json({
                success: true,
                agentId: sendOtp.data.agentId,
                agentUid:sendOtp.data.agentUid,
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
        console.log("error : ", error);
        return res.status(599).json(resError599);
    }
};
