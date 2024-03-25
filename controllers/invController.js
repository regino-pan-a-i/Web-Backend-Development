const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  const grid = await utilities.buildClassificationGrid(data)
  let nav = await utilities.getNav()
  const className = data[0].classification_name
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  })
}


/* ***************************
* Build details view
* ***************************/

invCont.buildDetails = async function (req, res, next) {
  const car_id = req.params.car_id
  const data = await invModel.getDetails(car_id)
  let nav = await utilities.getNav()
  let details = await utilities.buildDetails(data)
  res.render("./inventory/details", {
    title: data.inv_make + " " + data.inv_model,
    nav,
    details,
  })
}

/* ***************************
* Build Management view
* ***************************/
invCont.buildManagement = async function (reg, res, next) {
  let nav = await utilities.getNav();
  const classificationSelect = await utilities.buildClassificationList()
  res.render("./inventory/management", {
    title: "Inventory Management", 
    nav,
    classificationSelect,
  })
}


/* ***************************
* Build Add Classification view
* ***************************/
invCont.buildAddClassification = async function (req, res, next) {
  let nav = await utilities.getNav();
  res.render("./inventory/add-classification", {
    title: "Add Classification",
    nav,
    errors: null,
  })
}

/* ***************************
* Build Add Inventory view
* ***************************/
invCont.buildAddInventory = async function (req, res, next) {
  let nav = await utilities.getNav();
  const list = await utilities.buildClassificationList()
  res.render("./inventory/add-inventory", {
    title: "Add a new car to our inventory",
    nav,
    errors: null,
    list
  })
}

/* ***************************
 * Add Classification
 * ***************************/

invCont.addClassification = async function (req, res, next) {
  try{
    const classification_name = req.body.classification_name
    await invModel.addClassification(classification_name)
    const nav = await utilities.getNav()
    req.flash("notice", 'Classification created successfully.')
    res.status(200).render("inventory/management", {
      title: "Add Classification",
      nav,
      errors: null,
    })
  } catch (error) {
    req.flash("notice", 'Sorry, there was an error adding the classification.')
    res.status(501).render("inventory/add-classification", {
      title: "Add Classification",
      nav,
      errors: null,
    })
  }
}

/* ***************************
 * Add Inventory
 * ***************************/
invCont.addInventory = async function (req, res, next) {

  const nav = await utilities.getNav()
  const { inv_make, inv_model, inv_year, inv_description,inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id } = req.body
  try {
    await invModel.addInventory(inv_make, inv_model, inv_year, inv_description,inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id)
    req.flash("message", 'Inventory added successfully.')
    res.status(200).render("inventory/management", {
      title: "Add Inventory",
      nav,
      errors: null,
    })
  } catch (error) {
    const list = await utilities.buildClassificationList(classification_id)
    req.flash("notice", 'Sorry, there was an error adding the inventory.')
    res.status(501).render("inventory/add-inventory", {
      title: "Add Inventory",
      nav,
      errors: null,
      list
    })
  }
}


/* ***************************
 *  Return Inventory by Classification As JSON
 * ************************** */
invCont.getInventoryJSON = async (req, res, next) => {
  const classification_id = parseInt(req.params.classification_id)
  const invData = await invModel.getInventoryByClassificationId(classification_id)
  if (invData[0].inv_id) {
    return res.json(invData)
  } else {
    next(new Error("No data returned"))
  }
}


/* ***************************
 *  Build Edit Inventory form
 * ************************** */

invCont.buildEdit = async (req, res, next) => {
  const inv_id = parseInt(req.params.inv_id)
  const data = await invModel.getDetails(inv_id)
  const classificationSelect = await utilities.buildClassificationList(data.classification_id)
  const itemName = `${data.inv_make} ${data.inv_model}`
  let nav = await utilities.getNav()
  res.render("./inventory/edit", {
    title: "Edit " + itemName,
    nav,
    classificationSelect: classificationSelect,
    errors: null,
    inv_id: data.inv_id,
    inv_make: data.inv_make,
    inv_model: data.inv_model,
    inv_year: data.inv_year,
    inv_description: data.inv_description,
    inv_image: data.inv_image,
    inv_thumbnail: data.inv_thumbnail,
    inv_price: data.inv_price,
    inv_miles: data.inv_miles,
    inv_color: data.inv_color,
    classification_id: data.classification_id
  })
}

/* ***************************
 * Update Inventory
 * ***************************/
invCont.updateInventory = async function (req, res, next) {
  
  const nav = await utilities.getNav()
  const { inv_id, inv_make, inv_model, inv_year, inv_description,inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id } = req.body
  // console.log(inv_image)
  // console.log(inv_thumbnail)
  const updateResult = await invModel.updateInventory(
    inv_id,  
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id
    )
  if (updateResult){
    const itemName = updateResult.inv_make + " " + updateResult.inv_model
    req.flash("message", `The ${itemName} has been updated.`)
    res.redirect("/inv/")
  } else {
    const classificationSelect = await utilities.buildClassificationList(classification_id)
    const itemName = updateResult.inv_make + " " + updateResult.inv_model
    req.flash("notice", 'Sorry, there was an error updating the inventory.')
    res.status(501).render("inventory/edit", {
      title: "Edit " + itemName,
      nav,
      classificationSelect: classificationSelect,
      errors: null,
      inv_id,
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color,
      classification_id
    })
  }
    
}
  
  
/* ***************************
  * Build delete view
  * ***************************/
invCont.deleteConfirmation = async function (req, res, next){
  const inv_id = parseInt(req.params.inv_id)
  const data = await invModel.getDetails(inv_id)
  const itemName = `${data.inv_make} ${data.inv_model}`
  let nav = await utilities.getNav()
  res.render("./inventory/delete-confirmation", {
    title: "Delete " + itemName,
    nav,
    errors: null,
    inv_id: data.inv_id,
    inv_make: data.inv_make,
    inv_model: data.inv_model,
    inv_year: data.inv_year,
    inv_price: data.inv_price
  })
}
  

/* ***************************
 * Delete Inventory
 * ***************************/
invCont.deleteInventory = async function (req, res, next) {
  const nav = await utilities.getNav()
  const inv_id = parseInt(req.body.inv_id)
  const {inv_make, inv_model, inv_year, inv_price } = req.body
  const deleteResult = await invModel.deleteInventory(inv_id)
 
  if (deleteResult){
    const itemName = req.body.inv_make + " " + req.body.inv_model
    req.flash("message", `The ${itemName} has been deleted.`)
    res.redirect("/inv/")
  } else {
    const itemName = req.body.inv_make + " " + req.body.inv_model
    req.flash("notice", 'Sorry, there was an error deleting the inventory.')
    res.status(501).render(`/delete/${inv_id}`, {
      title: "Delete " + itemName,
      nav,
      errors: null,
      inv_id,
      inv_make,
      inv_model,
      inv_year,
      inv_price
    })
  }
    
}



module.exports = invCont
  