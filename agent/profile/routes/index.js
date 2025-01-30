const express = require("express");
const router = express.Router();

/////// controller files /////////////////////
const verifyEmail = require("../controllers/verifyEmail")
const confirmEmailVerification = require("../controllers/confirmEmailVerification")
const addBankDetails = require("../controllers/addAgentBankDetails")
const getBankDetails = require("../controllers/getAgentBankDetails")
const updateProfile = require("../controllers/updateAgentProfile")

///// routes //////////////////////////////////
router.post("/verify-email",verifyEmail)
router.post("/confirm-email",confirmEmailVerification)
router.post("/bank-details",addBankDetails)
router.get("/bank-details",getBankDetails)
router.put("/details",updateProfile)

module.exports = router;
