// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const detailsController = require("../controllers/detailsController")
const utilities = require("../utilities/")

// Route to build inventory by classification view
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));


// Route to build details view
router.get("/detail/:car_id", utilities.handleErrors(detailsController.buildDetails));


module.exports = router;
