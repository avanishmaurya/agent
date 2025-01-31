const { resError400, resError500, resError401, resError599 } = require("../../../utils/resError")
const verifyOtp = require("../../utils/otp/validateOtp");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const registerAgent = require("../dbmodels/registerAgent");
const deleteAgentFromTempTable = require("../dbmodels/deleteAgentFromTempTable");
const getTemporaryData = require("../dbmodels/getTemporaryData");

module.exports = async (req, res) => {
    
    let rb = req.body;
    if (!rb) {
        return res.status(400).json(resError400);
    }

    let { agentUid, otp, otpToken, otpTokenPrev } = rb;

    if (!agentUid || !otp || !otpToken) {
        return res.status(400).json(resError400);
    }

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
        let uid = crypto.randomUUID();

        const tempData = await getTemporaryData(agentUid);

        if (!tempData.success || !tempData.data) {
            return res.status(500).json(resError500);
        }

        let td = tempData.data;

        let registrationData = {
            uid,
            agentId: td.agent_id,
            agentName: td.agentname,
            email: td.email,
            phoneNumber: td.phone_number,
            hpassword: td.hpassword,
            countryCode: td.country_code,
            address: td.address,
        };

        const result = await registerAgent(registrationData);

        if (result.success) {
            deleteAgentFromTempTable(agentUid);

            const agentData = result.data;

            //// Creating refresh token
            const r_token = jwt.sign(
                { id: agentData.agent_uid, agentId: agentData.agent_id },
                process.env.REFRESH_TOKEN_SECRET,
                { expiresIn: process.env.REFRESH_TOKEN_EXPIRE }
            );
            //// Creating access token
            const a_token = jwt.sign(
                { id: agentData.agent_uid, agentId: agentData.agent_id },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: process.env.ACCESS_TOKEN_EXPIRE }
            );

            /// Cookie configuration
            res.cookie("r_t", r_token, {
                maxAge: 730 * 24 * 3600000,
                httpOnly: true,
                // sameSite: "none",
                // secure: true,
            });

            return res.status(201).json({
                success: true,
                data: {
                    a_token,
                    agentName: agentData.agentname,
                    agentId: agentData.agent_id,
                    agentUid: agentData.agent_uid,
                    agentEmail: agentData.email,
                    agentPhone: agentData.phone_number,
                    referralCode: agentData.agent_referal_code,
                    countryCode: agentData.country_code,
                    address: agentData.address,
                    expiresIn: process.env.ACCESS_TOKEN_EXPIRE,
                    createdAt: agentData.created_at,
                },
                message: "agent registered successfully",
            });
        }
    } catch (error) {
        console.log("error : ", error);
        return res.status(599).json(resError599);
    }
};
