const jwt = require('jsonwebtoken')
require('dotenv').config();

module.exports = async (req, res) => {
    let result = {
        success: false,
        a_token: "",
        expiresIn: ""
    }

    let expiresIn = process.env.ACCESS_TOKEN_EXPIRE
    let a_token = ""

    try {
        if (req.cookies) {
            let token = req.cookies.r_t
            if (token) {
                let agent = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET)
                let { id, agentId } = agent     // id: agent's uid

                a_token = jwt.sign({ id: id, agentId: agentId },
                    process.env.ACCESS_TOKEN_SECRET,
                    { expiresIn: process.env.ACCESS_TOKEN_EXPIRE })
                result.success = true
                result.a_token = a_token
                result.expiresIn = expiresIn
            }
            return res.status(200).json(result)
        } else {
            return res.status(400).json(result)
        }
    }
    catch (e) {
        console.log(e.message)
        return res.status(599).json({ success: false, message: "Error verifying" })

    }
}