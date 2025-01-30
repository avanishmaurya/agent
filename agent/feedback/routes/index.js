const express = require('express')
const router = express.Router()

const postFeedback = require('../controllers/postFeedback')
const getFeedback = require('../controllers/getFeedback')


router.post("/",postFeedback)
router.get("/",getFeedback)

module.exports = router;