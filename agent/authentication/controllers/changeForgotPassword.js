const { resError400, resError500, resError599 } = require("../../../utils/resError")
const verifyOtp = require("../utils/otp/validateOtp")
const getAgentInfo = require("../dbmodels/getAgentInfo")
const { hashPassword } = require("../utils/passwordHash")
const changePassword = require("../dbmodels/changePassword")

module.exports = async (req, res) => {

    let rb = req.body
    if (!rb) {
        return res.status(400).json(resError400)
    }

    let { agentUid, otp, otpToken, otpTokenPrev, password, confirmPassword } = rb
    if (!agentUid || !otp || !otpToken || !password || !confirmPassword) {
        return res.status(400).json(resError400)
    }

    ////// Password validation //////////////////////
    if (password.length < 8 || password !== confirmPassword) {
        return res.status(400).json(resError400)
    }

    ///// OTP verification /////////////////////////
    const { isVerified, uuid } = await verifyOtp(otp, otpToken, otpTokenPrev)
    if (!isVerified) {
        return res.status(401).json({
            success: false,
            message: "Invalid OTP"
        })
    }
    if (agentUid !== uuid) {
        return res.status(401).json(resError401)
    }

    try {

        const agentInfo = await getAgentInfo(agentUid)

        if (!agentInfo.success || !agentInfo.data || !agentInfo.data.length) {
            return res.status(500).json(resError500)
        }

        let agentId = agentInfo.data[0].agent_id

        let hashedPassword = await hashPassword(password)

        const result = await changePassword(agentId, hashedPassword)

        if (result.success) {
            return res.status(200).json({
                success: true,
                data: result.data,
                message: "Password updated successfully"
            })
        } else {
            return res.status(500).json(resError500)
        }

    } catch (error) {
        console.log("error : ", error);
        return res.status(599).json(resError599)
    }
}