const utilities = require('.');
const { body, validationResult } = require("express-validator")
const validate = {}



/*  **********************************
 *  Add Inventory Validation Rules
 * ********************************* */
validate.addClassificationRules = () => {
  return [
    // valid classification name is required and must be string
    body("classification_name")
    .trim()
    .isLength({ min: 1 })
    .isString()
    .withMessage("Please provide a classification name."), // on error this message is sent.
  ]
}

/*  **********************************
 *  Add Inventory Validation Rules
 * ********************************* */
validate.addInventoryRules = () => {
  return [
    // valid make is required and must be string
    body("inv_make")
      .trim()
      .isLength({ min: 1 })
      .isString()
      .withMessage("Please provide a make."), // on error this message is sent.
    
    // valid model is required and must be string
    body("inv_model")
      .trim()
      .isLength({ min: 1 })
      .isString()
      .withMessage("Please provide a model."), // on error this message is sent.

    // valid year is required and must be string
    body("inv_year")
      .isLength({ min: 1 })
      .isInt({ min:1980, max:2025})
      .withMessage("Please provide a year."), // on error this message is sent.
    
    // valid description is required and must not have special characters
    body("inv_description")
      .trim()
      .isLength({ min: 1 })
      .isString()
      .matches(/^[A-Za-z\s]+$/) // only letters and spaces
      .withMessage("Please provide a description."), // on error this message is sent.
    
    // valid price is required and must be positive integer
    body("inv_price")
      .trim()
      .isLength({ min: 1 })
      .isInt({ min: 1 })
      .withMessage("Please provide a price."), // on error this message is sent.
    
    // valid miles is required and must be positive integer
    body("inv_miles")
      .trim()
      .isLength({ min: 1 })
      .isInt({ min: 1 })
      .withMessage("Please provide miles."), // on error this message is sent.

    // valid color is required and must be string
    body("inv_color")
      .trim()
      .isLength({ min: 1 })
      .isString()
      .withMessage("Please provide a color."), // on error this message is sent.
  ]
}


/* ******************************
 * Check data and return errors or continue to registration
 * ***************************** */
validate.checkNewClassification = async (req, res, next) => {
    const { classification_name } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
      let nav = await utilities.getNav()
      res.render("inventory/add-classification", {
        errors,
        title: "Add Classification",
        nav,
        classification_name
      })
      return
    }
    next()
}


/* ******************************
 * Check data and return errors or continue to registration
 * ***************************** */
validate.checkNewInventory = async (req, res, next) => {
    const { inv_make, inv_model, inv_year, inv_description, inv_price, inv_miles, inv_color } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
      let nav = await utilities.getNav()
      let list = await utilities.buildClassificationList();

      res.render("inventory/add-inventory", {
        errors,
        title: "Add Inventory",
        nav,
        list,
        inv_make,
        inv_model,
        inv_year,
        inv_description,
        inv_price,
        inv_miles,
        inv_color
      })
      return
    }
    next()
}

module.exports = validate