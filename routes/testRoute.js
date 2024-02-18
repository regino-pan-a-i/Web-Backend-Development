// Needed Resources 
const express = require("express")
const router = new express.Router() 
const testController = require("../controllers/testController")
const utilities = require("../utilities")



router.get("/", utilities.handleErrors(testController.error));


module.exports = router;