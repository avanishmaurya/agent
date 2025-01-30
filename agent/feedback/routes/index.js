const express = require('express')
const router = express.Router()

const postFeedback = require('../controllers/postFeedback')
const getFeedbacks = require('../controllers/getFeedbacks')


router.post("/",postFeedback)
router.get("/",getFeedbacks)

module.exports = router;