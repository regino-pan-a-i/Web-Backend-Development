const utilities = require('../utilities');
const { body, validationResult } = require("express-validator")
const validate = {}

/* ******************************
 * Check data and return errors or continue to registration
 * ***************************** */
validate.checkNewInventory = async (req, res, next) => {
    const { inv_make, inv_model, inv_year, inv_description, inv_price, inv_miles, inv_color } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
      let nav = await utilities.getNav()
      let form = await utilities.buildAddInventoryForm();

      res.render("account/register", {
        errors,
        title: "Registration",
        nav,
        form,
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