const express = require('express')
const router = express.Router()

const verifyAdhaar = require('../controllers/verifyAdhaar')

router.get("verify/", verifyAdhaar)


module.exports = router;