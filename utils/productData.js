// pro vocab crossword
const PRO_VOCAB_ID = 101
const PRO_VOCAB_NAME = "pro vocab crossword"
const PRO_VOCAB_COMMISSION = 10             // 10 percentage

// common vocab crossword
const COMMON_VOCAB_ID = 102
const COMMON_VOCAB_NAME = "common vocab crossword"
const COMMON_VOCAB_COMMISSION = 10

// simple gk crossword
const SIMPLE_GK_ID = 103
const SIMPLE_GK_NAME = "simple gk crossword"
const SIMPLE_GK_COMMISSION = 10


const data = [
    {
        "productId": PRO_VOCAB_ID,
        "productName": PRO_VOCAB_NAME,
        "commission": PRO_VOCAB_COMMISSION
    },
    {
        "productId": COMMON_VOCAB_ID,
        "productName": COMMON_VOCAB_NAME,
        "commission": COMMON_VOCAB_COMMISSION
    },
    {
        "productId": SIMPLE_GK_ID,
        "productName": SIMPLE_GK_NAME,
        "commission": SIMPLE_GK_COMMISSION
    }
]

const productDataById = (id) => {
    return data.find(product => product.productId === id) || null;
};

module.exports = { productDataById }