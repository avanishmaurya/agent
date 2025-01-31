const { resError401, resError500, resError599 } = require("../../../utils/resError")
const getAgentBankDetails = require("../dbmodels/getAgentBankDetails")

module.exports = async (req, res) => {

    let agentUid = !(req.auth) ? '' : req.auth.agentUid
    let agentId = !(req.auth) ? '' : req.auth.agentId
    if (!agentUid || !agentId) {
        return res.status(401).json(resError401)
    }

    try {
        
        const result = await getAgentBankDetails(agentId)

        if(result.success && result.data){
            return res.status(200).json({
                success:true,
                data:result.data,
                messsage:"Bank details fetched successfully"
            })
        }else{
            return res.status(500).json(resError500)
        }

    } catch (error) {
        console.log("error : ",error);
        return res.status(599).json(resError599) 
    }
}