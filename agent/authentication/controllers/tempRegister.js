const { resError400, resError599 } = require("../../../utils/resError");
const validateRegistration = require("../utils/validation/validateRegistration");
const getExistingAgent = require("../dbmodels/getExistingAgent");
const { hashPassword } = require("../utils/passwordHash");
const temporaryRegister = require("../dbmodels/temporaryRegister");
const sendMobileOTP = require("../../utils/otp/sendMobileOtp");

module.exports = async (req, res) => {

    let rb = req.body;
    if (!rb) {
        return res.status(400).json(resError400);
    }

    let agentData;

    try {
        ///////// validate registration data ///////////
        agentData = await validateRegistration({ ...rb });

        if (agentData.errors.numError) {
            return res.status(400).json({
                success: false,
                errors: agentData.errors,
            });
        }

        // check whether the agent is already exist or not
        const existingAgent = await getExistingAgent(agentData.agentId);

        if (!existingAgent.success) {
            return res.status(400).json({
                success: false,
                message: "Error while registration",
            });
        }

        if (existingAgent.data && existingAgent.data.length) {
            return res.status(406).json({// Error code 406 Not Acceptable
                success: false,
                message: "Already registered",
            });
        }

        // hash the password
        let agent = {};
        let hashedPassword = await hashPassword(rb.password);
        agent.agentName = rb.agentName;
        agent.countryCode = rb.countryCode;
        agent.agentId = agentData.agentId;
        agent.phone = agentData.phone;
        agent.password = hashedPassword;
        agent.address = rb.address;

        // save registration data in a temporary table
        const result = await temporaryRegister(agent);

        if (result.success) {
            let agentUid = result.data.agent_uid;
            let agentId = result.data.agent_id;

            let sendOtp = await sendMobileOTP(agentId, agentUid);

            if (sendOtp.success) {
                return res.status(200).json({
                    success: true,
                    data: result.data,
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
        } else {
            return res.status(500).json({
                success: false,
                errors: {
                    message: "ERROR signing up",
                    userId: agentData.agentId,
                },
            });
        }
    } catch (error) {
        console.log("error : ", error);
        return res.status(599).json(resError599);
    }
};
