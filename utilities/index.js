const invModel = require("../models/inventory-model")
const Util = {}
const jwt = require('jsonwebtoken')
require('dotenv').config()

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
  let data = await invModel.getClassifications()
  let list = "<ul>"
  list += '<li><a href="/" title="Home page">Home</a></li>'
  data.rows.forEach((row) => {
    list += "<li>"
    list +=
      '<a href="/inv/type/' +
      row.classification_id +
      '" title="See our inventory of ' +
      row.classification_name +
      ' vehicles">' +
      row.classification_name +
      "</a>"
    list += "</li>"
  })
  list += "</ul>"
  return list
}

/* **************************************
* Build the classification view HTML
* ************************************ */
Util.buildClassificationGrid = async function(data){
  let grid
  if(data.length > 0){
    grid = '<ul id="inv-display">'
    data.forEach(vehicle => { 
      grid += '<li>'
      grid +=  '<a href="../../inv/detail/'+ vehicle.inv_id 
      + '" title="View ' + vehicle.inv_make + ' '+ vehicle.inv_model 
      + 'details"><img src="' + vehicle.inv_thumbnail 
      +'" alt="Image of '+ vehicle.inv_make + ' ' + vehicle.inv_model 
      +' on CSE Motors" /></a>'
      grid += '<div class="namePrice">'
      grid += '<hr />'
      grid += '<h2>'
      grid += '<a href="../../inv/detail/' + vehicle.inv_id +'" title="View ' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + '</a>'
      grid += '</h2>'
      grid += '<span>$' 
      + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
      grid += '</div>'
      grid += '</li>'
    })
    grid += '</ul>'
  } else { 
    grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
  }
  return grid
}

/* **************************************
 * Build the details view
 * ************************************ */

Util.buildDetails = async function(data){
  let details = '<div id="details">'
  details += '<img src="' + data.inv_image + '" alt="Image of ' 
  + data.inv_make + ' ' + data.inv_model + ' on CSE Motors" />'
  details += '<div class="info">'
  details += '<h1>' + data.inv_make + ' ' + data.inv_model + '</h1>'
  details += '<ul>'
  details += '<li> Classificaiton: ' + data.classification_name + '</li>'
  details += '<li> Year: ' + data.inv_year + '</li>'
  details += '<li> Miles: ' + new Intl.NumberFormat('en-US').format(data.inv_miles) + '</li>'
  details += '<li> Price: $' + new Intl.NumberFormat('en-US').format(data.inv_price) + '</li>'
  details += '<li> Color: ' + data.inv_color + '</li>'
  details += '<li>Stock: ' + data.inv_stock + '</li>'
  details += '</ul>'
  details += '<p>' + data.inv_description + '</p>' 
  details += '</div>'
  details += '</div>'
  return details

}

/* **************************************
 * Build the dropdown classification list
 * ************************************ */
Util.buildClassificationList = async function(classification_id){
  console.log(classification_id)
  let data = await invModel.getAllClassifications()
  let classificationList = 
    `<label for = "classification_id">Classification: </label>
    <select name="classification_id" id="classification_id" required>`

  classificationList += "<option value=''>Select a Classification</option>"
  data.forEach( classification =>{
    classificationList += "<option value='" + classification.classification_id + "'"
    if(
      classification_id != null &&
      classification.classification_id == classification_id
    ){
      classificationList += " selected "
    }
    classificationList += ">" + classification.classification_name + "</option>"
  })
  classificationList += "</select>"
  
  return classificationList
}

/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)


/* ****************************************
* Middleware to check token validity
**************************************** */
Util.checkJWTToken = (req, res, next) => {
  if (req.cookies.jwt) {
   jwt.verify(
    req.cookies.jwt,
    process.env.ACCESS_TOKEN_SECRET,
    function (err, accountData) {
     if (err) {
      req.flash("notice","Please log in")
      res.clearCookie("jwt")
      return res.redirect("/account/login")
     }
     res.locals.accountData = accountData
     res.locals.loggedin = 1
     next()
    })
  } else {
   next()
  }
}


module.exports = Util