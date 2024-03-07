// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const utilities = require("../utilities/")
const invValidate = require('../utilities/management-validation')

// Route to build inventory by classification view
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));

// Route to build details view
router.get("/detail/:car_id", utilities.handleErrors(invController.buildDetails));

// Route to build inventory manager view
router.get("/", utilities.handleErrors(invController.buildManagement));

// Route to add Classifications
router.get("/add-classification", utilities.handleErrors(invController.buildAddClassification));

// Process the add classification form
router.post(
    "/add-classification",
    invValidate.addClassificationRules(),
    invValidate.checkNewClassification,
    utilities.handleErrors(invController.addClassification)
);
    
// Route to add to inventory
router.get("/add-inventory", utilities.handleErrors(invController.buildAddInventory));

// Process the add classification form
router.post(
    "/add-inventory",
    invValidate.addInventoryRules(),
    invValidate.checkNewInventory,
    utilities.handleErrors(invController.addInventory)
);
   

module.exports = router;
