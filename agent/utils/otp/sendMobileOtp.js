const axios = require("axios");
const jwt = require("jsonwebtoken")
const dotenv = require("dotenv");
dotenv.config();
const generateOTP = require("./generateOtp");

module.exports = async (agentId, agentUid) => {
    
    if (!agentId || !agentUid) {
        return { success: false };
    }

    let otp = await generateOTP(100000, 999999);
    console.log("otp : ", otp); // to be removed

    let secret = process.env.FAST2SMS_JWT_SECRET + otp;

    let otpToken = jwt.sign({ id: agentUid, userId: agentId }, secret, {
        expiresIn: process.env.OTP_TOKEN_EXPIRE,
    });

    let number;

    if (agentId.startsWith("+91")) {
        number = agentId.slice(3);
    }

    const auth_key = process.env.FAST2SMS_AUTH_KEY;

    try {
        const data = {
            route: "dlt",
            sender_id: "VOCROS",
            message: "178554",
            variables_values: `${otp}`,
            flash: 0,
            numbers: `${number}`,
        };

        const config = {
            headers: {
                authorization: auth_key,
                "Content-Type": "application/json",
            },
        };
        const url = "https://www.fast2sms.com/dev/bulkV2";
        const res = await axios.post(url, data, config);

        return {
            success: true,
            data: {
                agentId,
                otpToken,
                agentUid
            },
        };
    } catch (error) {
        console.log("error: ", e.message);
        return { success: false, error: e.message };
    }
};
