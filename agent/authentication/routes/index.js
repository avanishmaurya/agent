const express = require("express");
const router = express.Router();

/////// controller files /////////////////////
const register = require("../controllers/register");
const tempRegister = require("../controllers/tempRegister")
const login = require("../controllers/login")
const forgotPassword = require("../controllers/forgotPassword")
const changeForgotPassword = require("../controllers/changeForgotPassword")
const resendOtp = require("../controllers/resendOtp")
const getAccessToken = require("../controllers/getAccessToken")
const getAgentStatus = require("../controllers/getAgentStatus")
const logout = require("../controllers/logout")


///// routes //////////////////////////////////
router.post("/register", register);
router.post("/temp-register",tempRegister)
router.post("/login",login)
router.post("/forgot-password",forgotPassword)
router.post("/change-forgot-password",changeForgotPassword)
router.post("/resend-otp",resendOtp)
router.get("/access-token",getAccessToken)
router.get("/agent-status",getAgentStatus)
router.get("/logout",logout)

module.exports = router;
