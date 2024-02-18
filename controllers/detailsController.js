const utilities = require("../utilities")
const detailsModel = require("../models/details-model")

const detailsCont = {}

/* ***************************
 * Build details view
 * ***************************/

detailsCont.buildDetails = async function (req, res, next) {
  const car_id = req.params.car_id
  const data = await detailsModel.getDetails(car_id)
  let nav = await utilities.getNav()
  let details = await utilities.buildDetails(data)
  res.render("./inventory/details", {
    title: data.inv_make + " " + data.inv_model,
    nav,
    details,
  })
}

module.exports = detailsCont;