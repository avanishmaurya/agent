const express = require('express')
const router = express.Router()

const getPaymentHistory = require('../controllers/getPaymentHistory')

router.get("/history", getPaymentHistory)

module.exports = router;
