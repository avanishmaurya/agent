const PRO_VOCAB_CROSSWORD_COMMISSION = 10     // 10 PERCENTAGE
const VIDYAVART_COMMISSION = 15                // 15 PERCENTAGE

const commissionPercentage = {
    "101": PRO_VOCAB_CROSSWORD_COMMISSION,
    "102": VIDYAVART_COMMISSION
}
module.exports = async () => {
    return commissionPercentage
}