const getReferredUsersSubDetails = require("../dbmodels/getReferredUsersSubDetails")
const { resError401, resError599, resError500 } = require("../../../utils/resError")
const calculateCommission = require('../utils/calculateCommission')

module.exports = async (req, res) => {

    let agentUid = !(req.auth) ? '' : req.auth.agentUid
    if (!agentUid) {
        return res.status(401).json(resError401)
    }

    try {

        let result = await getReferredUsersSubDetails(agentUid)
        if (result.success && result.data) {
            // commission added 
            const result2 =  calculateCommission(result.data)
            if (result2.success) {
                return res.status(200).json({
                    success: true,
                    data: result.data,
                    total: result2.data,
                    message: "Referred users subscription details fetched successfully"
                })
            } else {
                return res.status(500).json(resError500)
            }
        } else {
            return res.status(500).json(resError500)
        }

    } catch (error) {
        console.log("error: ", error);
        return res.status(599).json(resError599)

    }
}