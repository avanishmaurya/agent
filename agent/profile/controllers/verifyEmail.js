const validator = require("validator");
const { resError400, resError401, resError599 } = require("../../../utils/resError")
const sendEmailOtp = require("../../utils/otp/sendEmailOtp")
const generateOTP = require("../../utils/otp/generateOtp")
const jwt = require("jsonwebtoken")
const dotenv = require("dotenv")
dotenv.config()

module.exports = async (req, res) => {

    let agentUid = !(req.auth) ? '' : req.auth.agentUid
    let agentId = !(req.auth) ? '' : req.auth.agentId
    if (!agentUid || !agentId) {
        return res.status(401).json(resError401)
    }

    let rb = req.body
    let email = req.body.email
    if (!rb || !email) {
        return res.status(400).json(resError400)
    }

    try {

        email = String(email)

        let verified = validator.isEmail(email)
        if (verified) {

            let otp = await generateOTP(100000, 999999)
            console.log("otp : ",otp);   ///////////// to be removed

            let secret = process.env.OTP_JWT_SECRET + otp;
            
                let otpToken = jwt.sign({ id: agentUid, userId: agentId }, secret, {
                    expiresIn: process.env.OTP_TOKEN_EXPIRE,
                });

            const sendOtp = await sendEmailOtp(email,otp)

            if(sendOtp.success){
                return res.status(200).json({
                    success:true,
                    otpToken:otpToken,
                    otpSent:true
                })
            }else{
                return res.status(500).json({
                    success:false,
                    otpSent:false,
                    message:"Error sending OTP"
                })
            }
        } 


    }catch (error) {
        console.log("error : ",error);
        return res.status(599).json(resError599)
    }
}