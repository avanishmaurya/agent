const { resError400, resError401, resError599, resError500 } = require("../../../utils/resError")
const validateAgentId = require("../utils/validation/validateAgentId")
const getActiveAgent = require("../dbmodels/getActiveAgent")
const { comparePassword } = require("../utils/passwordHash")
const getAgentData = require("../dbmodels/getAgentData")
const jwt = require("jsonwebtoken")
const dotenv = require("dotenv")
dotenv.config()

const MIN_WAIT_TIME_FAILED_LOGIN = 1000 // in miliseconds

module.exports = async (req, res) => {

    let rb = req.body
    if (!rb) {
        return res.status(400).json(resError400)
    }

    let { agentId, password, countryCode } = rb

    if (!agentId || !password || !countryCode) {
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

        ///// verifying password ///////////////
        let hpassword = result.data[0].hpassword
        let match = await comparePassword(password, hpassword)

        if (!match) {
            setTimeout(() => {
                return res.status(401).json(resError401)
            }, MIN_WAIT_TIME_FAILED_LOGIN)
        } else {

            const getAgentDetails = await getAgentData(agentId)

            if (!getAgentDetails.success || !getAgentDetails.data || !getAgentDetails.data.length) {
                return res.status(500).json(resError500)
            }

            let agentData = getAgentDetails.data[0]

            //// Creating refresh token
            const r_token = jwt.sign(
                { id: agentData.agent_uid, agentId: agentData.agent_id },
                process.env.REFRESH_TOKEN_SECRET,
                { expiresIn: process.env.REFRESH_TOKEN_EXPIRE }
            )

            //// Creating access token
            const a_token = jwt.sign(
                { id: agentData.agent_uid, agentId: agentData.agent_id },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: process.env.ACCESS_TOKEN_EXPIRE }
            )

            /// Cookie configuration
            res.cookie("r_t", r_token, {
                maxAge: 730 * 24 * 3600000,
                httpOnly: true,
                // sameSite: "none",
                // secure: true,
            });

            return res.status(200).json({
                success: true,
                data: {
                    a_token,
                    agentUid: agentData.agent_uid,
                    agentId: agentData.agent_id,
                    agentName: agentData.agentname,
                    email: agentData.email,
                    phone: agentData.phone_number,
                    address: agentData.address,
                    referralCode: agentData.agent_referal_code,
                    referralCount: agentData.referral_count,
                    createdAt: agentData.created_at,
                    countryCode: agentData.country_code,
                    countryName: agentData.country_name,
                    emailVerified: agentData.email_verified,
                    bankVerified: agentData.bank_verified,
                    aadharVerified: agentData.adhar_verified,
                    profilePic: agentData.profile_pic_url,
                    profileImageSizes: agentData.profile_image_sizes,
                    expiresIn: process.env.ACCESS_TOKEN_EXPIRE
                },
                message: "Agent logged in successfully"
            })
        }

    } catch (error) {
        console.log("error : ", error);
        return res.status(599).json(resError599)
    }
}