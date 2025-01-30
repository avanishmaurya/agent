const deleteQuery = require("../dbmodels/deleteQuery")
const { resError401, resError599, resError400 } = require("../../../utils/resError")

module.exports = async (req,res) =>{

    let agentUid = !(req.auth) ? '' : req.auth.agentUid
    if(!agentUid){
        return res.status(401).json(resError401)
    }

    let queryId = !(req.params) ? '' : req.params.queryId
    if(!queryId){
        return res.status(400).json(resError400)
    }

    try {
        
        const result = await deleteQuery(queryId)
        if(result.success){
            return res.status(200).json({
                success:true,
                data:result.data
            })
        }else{
            return res.status(500).json({
                success:false,
                message:"Error while deleting a query"
            })
        }

    } catch (error) {
        console.log("error : ",error);
        return res.status(599).json(resError599)
        
    }
}