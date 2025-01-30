const { resError400, resError599 } = require("../../../utils/resError")
const getActiveAgent = require("../dbmodels/getActiveAgent")
const getAgentData = require("../dbmodels/getAgentData")
const sendMobileOtp = require("../../utils/otp/sendMobileOtp")
const validateAgentId = require("../utils/validation/validateAgentId")


module.exports = async (req, res) => {

    let rb = req.body
    if (!rb) {
        return res.status(400).json(resError400)
    }

    let { agentId, countryCode } = rb
    if (!agentId || !countryCode) {
        return res.status(400).json(resError400)
    }

    /////  validating agentId
    let agentIdValidation = await validateAgentId(agentId)

    if (!agentIdValidation.isValid) {
        return res.status(400).json(resError400)
    }

    agentId = agentIdValidation.agentId

    try {

        //// Check whether the agent is registered or not //////////
        const result = await getActiveAgent(agentId)

        if (!result.success || !result.data || !result.data.length) {

            return res.status(400).json({
                success: false,
                message: "Given agentId is either not registered or deleted"
            })
        }

        const getAgentDetails = await getAgentData(agentId)

        if (getAgentDetails.data && getAgentDetails.data.length) {

            let agentData = getAgentDetails.data[0]
            let agentId = agentData.agent_id
            let agentUid = agentData.agent_uid

            const sendOtp = await sendMobileOtp(agentId, agentUid);

            if (sendOtp.success) {
                return res.status(200).json({
                    success: true,
                    agentUid: agentUid,
                    agentId: agentId,
                    agentName: agentData.agentname,
                    otpSent: true,
                    otpToken: sendOtp.data.otpToken,
                    message: "OTP send successfully"
                });
            } else {
                return res.status(500).json({
                    success: false,
                    otpSent: false,
                    message: "Error sending OTP",
                });
            }

        } else {
            return res.status(400).json({
                success: false,
                message: "Invalid agentId"
            })
        }

    } catch (error) {
        console.log("error : ", error);
        return res.status(599).json(resError599)

    }
}