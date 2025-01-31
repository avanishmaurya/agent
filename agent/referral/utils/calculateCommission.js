const { productDataById } = require('../../../utils/productData')

module.exports = (data) => {
    try {
        let totalAmount = 0
        let totalCommission = 0

        for (let i = 0; i < data.length; i = i + 1) {
            let amount = data[i].amount
            amount = (amount / 100)            // amount in rupees
            let productId = data[i].product_id

            const productData = productDataById(productId)
            const percentage = productData.commission
            const productName = productData.productName

            let commission = amount * (percentage / 100)

            data[i].commission = parseInt(commission.toFixed(2))   // precise two decimal place
            data[i].amount = parseInt(amount.toFixed(2))
            data[i].commssion_percentage = percentage
            data[i].productName = productName

            totalAmount = totalAmount + amount
            totalCommission = totalCommission + commission
        }

        return {
            success: true,
            data: {
                totalAmount: parseInt(totalAmount.toFixed(2)),
                totalCommission: parseInt(totalCommission.toFixed(2))
            }
        }

    } catch (error) {
        console.log("error:", error)
        return { success: false }
    }
}