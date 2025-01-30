const express = require("express");
const router = express.Router();

const authRoutes = require("../authentication/routes");
const profileRoutes = require("../profile/routes")
const queriesRoutes = require("../queries/routes");
const feedbackRoutes = require("../feedback/routes");
const paymentRoutes = require("../payment/routes");
const referralRoutes = require("../referral/routes");


router.use("/auth", authRoutes);
router.use("/profile",profileRoutes)
router.use("/query", queriesRoutes);
router.use("/feedback", feedbackRoutes);
router.use("/payment", paymentRoutes);
router.use("/referral", referralRoutes);


module.exports = router;
