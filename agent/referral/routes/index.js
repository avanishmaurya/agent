const express = require('express')
const router = express.Router()

const getReferredUsersSubDetails = require('../controllers/getReferredUsersSubDetails')
const getNumUsersEachProduct = require('../controllers/getNumUsersEachProduct')

//get  all the subscription  details of the users who are refered by spefic agent.
router.get("/referred-users/sub-details", getReferredUsersSubDetails)  

// get the number of referred users , for each product by specific agent
router.get('/num-users/each-product', getNumUsersEachProduct)

module.exports = router;
