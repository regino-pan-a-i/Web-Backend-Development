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
router.get("/", utilities.checkLogin, utilities.checkAccount, utilities.handleErrors(invController.buildManagement));

// Route to add Classifications
router.get("/add-classification", utilities.checkLogin, utilities.checkAccount, utilities.handleErrors(invController.buildAddClassification));

// Process the add classification form
router.post(
    "/add-classification",
    invValidate.addClassificationRules(),
    invValidate.checkNewClassification,
    utilities.handleErrors(invController.addClassification)
);
    
// Route to add to inventory
router.get("/add-inventory", utilities.checkLogin, utilities.checkAccount, utilities.handleErrors(invController.buildAddInventory));

// Process the add classification form
router.post(
    "/add-inventory",
    invValidate.addInventoryRules(),
    invValidate.checkNewInventory,
    utilities.handleErrors(invController.addInventory)
);

// Router to get Inventory
router.get("/getInventory/:classification_id", utilities.handleErrors(invController.getInventoryJSON))


// Route to build the edit view
router.get("/edit/:inv_id",utilities.checkLogin, utilities.checkAccount, utilities.handleErrors(invController.buildEdit));

// Route to process the edit form
router.post("/update/", 
    invValidate.addInventoryRules(),
    invValidate.checkUpdateData,
    utilities.handleErrors(invController.updateInventory)
);


// Route to delete inventory
router.get("/delete/:inv_id",utilities.checkLogin, utilities.checkAccount, utilities.handleErrors(invController.deleteConfirmation));


// Route to process the delete
router.post("/delete/", utilities.handleErrors(invController.deleteInventory));

// Route to error
router.get("/test", utilities.handleErrors(invController.throwError));

// Route to the approval page
router.get("/pending", utilities.checkLogin, utilities.checkAdmin, utilities.handleErrors(invController.buildApproval));

// Handle Inventory approval
router.get("/approve/inventory/:inv_id", utilities.handleErrors(invController.approveInventory));

// Handle Category approval
router.get("/approve/classification/:classification_id", utilities.handleErrors(invController.approveClassification));

module.exports = router;
