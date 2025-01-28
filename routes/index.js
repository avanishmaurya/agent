const express = require("express");
const router = express.Router();

const agentRoutes = require("../agent/routes");

router.use("/agents", agentRoutes);

module.exports = router;
