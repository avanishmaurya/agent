const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

module.exports = async (otp, otpToken, otpTokenPrev) => {
    try {
        let isVerified = false;
        let tokenResult = null;
        let uuid=''

        // First verify the current OTP token
        try {
            tokenResult = jwt.verify(otpToken, process.env.OTP_JWT_SECRET + otp);

            isVerified = true;
            uuid = tokenResult.id

        } catch (error) {
            console.log("Current OTP token verification failed, trying previous OTP token.");
        }

        // If current OTP token is not verified, verify the previous OTP token
        if (!isVerified && otpTokenPrev) {

            try {
                tokenResult = jwt.verify(otpTokenPrev,process.env.OTP_JWT_SECRET + otp);

                isVerified = true;
                uuid = tokenResult.id

            } catch (error) {
                console.log("Previous OTP token verification failed.");
            }
        }
        

        return {isVerified,uuid};
    } catch (error) {
        console.error("Error verifying OTP:", error.message);
        return {isVerified,uuid}
    }

    
};
