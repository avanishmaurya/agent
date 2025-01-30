const productCommission = require('../../../utils/productCommission')

module.exports = async (data) => {
    try {
        let totalAmount = 0
        let tatalCommission = 0
        const commissionPercenatge = await productCommission()
        for (let i = 0; i < data.length; i = i + 1) {
            let amount = data[i].amount
            amount = parseInt(amount / 100)    // amount in rupees
            let productId = data[i].product_id

            const percentage = commissionPercenatge[productId]
            let commission = parseInt(amount * (percentage / 100))
            data[i].commission = commission   // in rupees 
            data[i].amount = amount
            data[i].commssion_percentage = percentage

            totalAmount = totalAmount + amount
            tatalCommission = tatalCommission + commission
        }

        return {
            success: true,
            data: {
                totalAmount,
                tatalCommission
            }
        }

    } catch (error) {
        console.log("error:", error)
        return { success: false }
    }
}