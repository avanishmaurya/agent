const getNumUsersEachProduct = require("../dbmodels/getNumUsersEachProduct")
const { resError401, resError599 } = require("../../../utils/resError")

module.exports = async (req, res) => {

    let agentUid = !(req.auth) ? '' : req.auth.agentUid
    if (!agentUid) {
        return res.status(401).json(resError401)
    }

    try {

        const result = await getNumUsersEachProduct(agentUid)
        if (result.success && result.data) {
            return res.status(200).json({
                success: true,
                data: result.data,
                message: "The number of referred users for each product fetched successfully"
            })
        } else {
            return res.status(500).json({
                success: false,
                message: "Error while fetching, The number of referred users for each product"
            })
        }

    } catch (error) {
        console.log("error: ", error);
        return res.status(599).json(resError599)

    }
}