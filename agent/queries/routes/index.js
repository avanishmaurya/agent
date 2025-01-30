const express = require('express')
const router = express.Router()

const postQuery = require('../controllers/postQuery')
const getQueries = require('../controllers/getQueries')
const deleteQuery = require('../controllers/deleteQuery')
const queryReply = require('../controllers/queryReply')

router.post("/", postQuery)
router.get("/", getQueries)
router.delete("/:queryId", deleteQuery)
router.put("/reply", queryReply)


module.exports = router;
