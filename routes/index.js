const express = require("express");
const router = express.Router();

const agentRoutes = require("../agent/routes");

router.get('/', function (req, res, next) {
    return res.send('<h1 style="text-align:center; color: blue;">Welcome to Admin dashboard</h1');
  });

router.use("/agents", agentRoutes);

module.exports = router;
