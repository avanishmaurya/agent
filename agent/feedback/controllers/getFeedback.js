const { resError401, resError599 } = require("../../../utils/resError")
const getFeedbacks = require("../dbmodels/getFeedback")

module.exports = async (req,res) =>{

    let agentUid = !(req.auth) ? '' : req.auth.agentUid
    if(!agentUid){
        return res.status(401).json(resError401)
    }

    try {
        
        const result = await getFeedbacks(agentUid)
        if(result.success){
            return res.status(200).json({
                success:true,
                data:result.data
            })
        }else{
            return res.status(500).json({
                success:false,
                message:"Error while retrieving feedbacks"
            })
        }

    } catch (error) {
        console.log("error : ",error);
        return res.status(599).json(resError599)
        
    }
}