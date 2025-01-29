const jwt = require('jsonwebtoken')
const getAgentData = require('../dbmodels/getAgentData')

module.exports = async (req, res) => {

    if (req.cookies) {
        let token = req.cookies.r_t
        if (token && token !== 'undefined') {
            try {
                let agent = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET)
                if (agent) {

                    let { id, agentId } = agent

                    // Generate a new access token   
                    const a_token = jwt.sign({ id: id, agentId: agentId }, process.env.ACCESS_TOKEN_SECRET,
                        { expiresIn: process.env.ACCESS_TOKEN_EXPIRE })

                    let agentData = await getAgentData(agentId)

                    if (agentData.success) {

                        let agentData1 = agentData.data[0]

                        return res.status(200).json({
                            success: true,
                            a_token,
                            userName: agentData1.agentname,
                            userUid: id,
                            data: agentData1,
                            expiresIn: process.env.ACCESS_TOKEN_EXPIRE
                        })
                    }
                    else {
                        return res.status(500).json({
                            success: false,
                            userId: "",
                            userName: "",
                            a_token: ""
                        })
                    }
                }
            } catch (e) {
                console.log(e.message)
                return res.status(500).json({
                    success: false,
                    userId: "",
                    userName: "",
                    a_token: ""
                })
            }
        }
    }

    return res.status(400).json({
        success: false,
        userId: "",
        userName: "",
        a_token: ""
    })
}