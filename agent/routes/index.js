const express = require("express");
const router = express.Router();

const authRoutes = require("../authentication/routes");

router.use("/auth", authRoutes);

module.exports = router;
