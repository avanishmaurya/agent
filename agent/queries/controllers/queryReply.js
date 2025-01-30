const queryReply = require("../dbmodels/queryReply")
const { resError400, resError401, resError500, resError599 } = require("../../../utils/resError")

module.exports = async (req, res) => {

    // let agentUid = !(req.auth) ? '' : req.auth.agentUid
    // if (!agentUid) {
    //     return res.status(401).json(resError401)
    // }


    let queryId = !(req.auth) ? '' : req.auth.queryId
    if (!queryId) {
        return res.status(401).json(resError400)
    }

    const rb = req.body
    if (!rb)
        return res.status(400).json(resError400)

    const replyText = rb.replyText
    if (!replyText) {
        return res.status(400).json(resError400)
    }

    try {

        const result = await queryReply(queryId, replyText)
        if (result.success) {
            return res.status(200).json({
                success: true,
                data: result.data,
                message: "Query replied  successfully"
            })
        } else {
            return res.status(500).json(resError500)
        }

    } catch (error) {
        console.log("error : ", error);
        return res.status(599).json(resError599)
    }
}
