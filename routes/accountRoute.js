// Needed Resources 
const express = require("express")
const router = new express.Router() 
const accountController = require("../controllers/accountController")
const utilities = require("../utilities/")
const regValidate = require('../utilities/account-validation')



// Route to build login view
router.get("/login", utilities.handleErrors(accountController.buildLogin));

// Route to build registration view
router.get("/register", utilities.handleErrors(accountController.buildRegister));


// Process the registration data
router.post(
  "/register",
  regValidate.registrationRules(),
  regValidate.checkRegData,
  utilities.handleErrors(accountController.registerAccount)
)
  
  
// Process the login attempt
router.post(
  "/login",
  regValidate.processLogin(),
  regValidate.checkLoginData,
  utilities.handleErrors(accountController.accountLogin)
)
  
// Route to build account landing page view
router.get("/", utilities.checkLogin, utilities.handleErrors(accountController.buildLandingPage));

// Route to build account info page
router.get("/profile", utilities.checkLogin, utilities.handleErrors(accountController.buildProfile));

// Process the Data update
router.post("/profile/update", 
  utilities.checkLogin, 
  regValidate.updateDataRules(),
  regValidate.checkUpdatedData,
  utilities.handleErrors(accountController.updateProfile)
);

// Process the Password update
router.post("/password-update", 
  utilities.checkLogin, 
  regValidate.updatePasswordRules(),
  regValidate.checkUpdatedData,
  utilities.handleErrors(accountController.updateProfile)
);


module.exports = router;
  
  