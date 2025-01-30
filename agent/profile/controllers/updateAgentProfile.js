const { resError400, resError599, resError401 } = require("../../../utils/resError")
const updateAgentProfile = require("../dbmodels/updateAgentProfile")

module.exports = async (req, res) => {

    let agentUid = !(req.auth) ? '' : req.auth.agentUid
    if (!agentUid) {
        return res.status(401).json(resError401)
    }

    let rb = req.body
    if(!rb){
        return res.status(400).json(resError400)
    }

    let {agentName,address} = rb

    ///// atleast one field needs to be filled while updating the profile /////////
    if(!agentName && !address){
        return res.status.json(resError400)
    }

    let agentDetails = {agentUid,agentName,address}
    try {
        
        const updateAgent = await updateAgentProfile(agentDetails)

        if(updateAgent.success){

            return res.status(200).json({
                success:true,
                data:updateAgent.data,
                message:"Agent profile updated successfully"
            })
        }else{
            return res.status(500).json({
                success:false,
                message:"Error while updating agent profile"
            })
        }

    } catch (error) {
        console.log("error : ",error);
        return res.status(599).json(resError599)
    }
}