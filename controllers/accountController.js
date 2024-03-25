const utilities = require("../utilities")
const accountController = {}
const accountModel = require("../models/account-model")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
require("dotenv").config()


/* ****************************************
*  Deliver login view
* *************************************** */
accountController.buildLogin = async function (req, res, next) {
    let nav = await utilities.getNav()
    res.render("account/login", {
      title: "Login",
      nav,
    })
  }
  

/* ****************************************
*  Deliver registration view
* *************************************** */
accountController.buildRegister = async function (req, res, next) {
  let nav = await utilities.getNav();
  res.render("account/register", {
    title: "Register",
    nav, 
    errors: null,
  })
}

/* ****************************************
*  Process Registration
* *************************************** */
accountController.registerAccount = async function(req, res) {
  let nav = await utilities.getNav()
  const { account_firstname, account_lastname, account_email, account_password } = req.body

  // Hash the password before storing
  let hashedPassword
  try {
    // regular password and cost (salt is generated automatically)
    hashedPassword = await bcrypt.hashSync(account_password, 10)
  } catch (error) {
    req.flash("notice", 'Sorry, there was an error processing the registration.')
    res.status(500).render("account/register", {
      title: "Registration",
      nav,
      errors: null,
    })
  }

  const regResult = await accountModel.registerAccount(
    account_firstname,
    account_lastname,
    account_email,
    hashedPassword
  )

  if (regResult) {
    req.flash(
      "message",
      `Congratulations, you\'re registered ${account_firstname}. Please log in.`
    )
    res.status(201).render("account/login", {
      title: "Login",
      nav,
    })
  } else {
    req.flash("notice", "Sorry, the registration failed.")
    res.status(501).render("account/register", {
      title: "Registration",
      nav,
    })
  }
}

/* ****************************************
 *  Process login request
 * ************************************ */
 accountController.accountLogin = async function(req, res) {
  let nav = await utilities.getNav()
  const { account_email, account_password } = req.body
  const accountData = await accountModel.getAccountByEmail(account_email)
  if (!accountData) {
    req.flash("notice", "Please check your credentials and try again.")
    res.status(400).render("account/login", {
    title: "Login",
    nav,
    errors: null,
    account_email,
    })
    return
  }
  try {
    if (await bcrypt.compare(account_password, accountData.account_password)) {
      delete accountData.account_password
      const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 * 1000 })
      if(process.env.NODE_ENV === 'development'){
        res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })
      } else {
        res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000, secure: true })
      }
      return res.redirect("/account/")
    }
  } catch (error) {
    return new Error('Access Forbidden')
  }
}

/* ****************************************
 *  Build account managment view
 * ************************************ */
accountController.buildLandingPage = async function (req, res) {
  let nav = await utilities.getNav()
  res.render("account/landing-page", {
    title: "You are logged in",
    nav,
  })
}

/* ****************************************
 *  Build profile information view view
 * ************************************ */
accountController.buildProfile = async function (req, res) {
  let nav = await utilities.getNav()
  let firstName = res.locals.accountData.account_firstname 
  let lastName = res.locals.accountData.account_lastname 
  let email = res.locals.accountData.account_email 
  res.render("account/profile", {
    title: "Profile",
    nav,
    errors: null,
    firstName,
    lastName,
    email,
  })
}


/* ****************************************
*  Update Account
* *************************************** */
accountController.updateProfile = async function(req, res) {
  let nav = await utilities.getNav()
  const { account_firstname, account_lastname, account_email, account_id} = req.body

  const updateResult = await accountModel.updateAccount(
    account_firstname,
    account_lastname,
    account_email,
    account_id
  )
  if (updateResult) {
    delete updateResult.account_password
    const accessToken = jwt.sign(updateResult, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 * 1000 })
    res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })
    let firstName = updateResult.account_firstname 

    req.flash(
      "message",
      `Your information was updated sucessfully.`
    )
    res.status(201).render("account/landing-page", {
      title: "You are logged in",
      nav,
      errors : null,
      firstName,

    })
  } else {
    req.flash("notice", "Sorry, the update process failed.")
    let firstName = account_firstname 
    let lastName = account_lastname
    let email = account_email
    res.status(501).render("account/profile", {
      title: "Profile",
      nav,
      errors: null,
      firstName,
      lastName,
      email,
    })
  }
}


/* ****************************************
*  Update Password
* *************************************** */
accountController.updatePassword = async function(req, res) {
  console.log("updatePassword")
  let nav = await utilities.getNav()
  const { account_password, account_id} = req.body
  let firstName = res.locals.accountData.account_firstname 
  let lastName = res.locals.accountData.account_lastname
  let email = res.locals.accountData.account_email

  // Hash the password before storing
  let hashedPassword
  try {
    // regular password and cost (salt is generated automatically)
    hashedPassword = await bcrypt.hashSync(account_password, 10)
  } catch (error) {
    req.flash("notice", 'Sorry, there was an error processing the registration.')
    res.status(500).render("account/profile", {
      title: "Profile",
      nav,
      errors: null,
      firstName,
      lastName,
      email,
    })
  }
  const updateResult = await accountModel.updatePassword(
    hashedPassword,
    account_id
  )
  if (updateResult && updateResult.account_password === hashedPassword) {
    delete updateResult.account_password

    req.flash(
      "message",
      `Your password was updated sucessfully.`
    )
    res.status(201).render("account/landing-page", {
      title: "You are logged in",
      nav,
      errors : null,
      firstName,
    })
  } else {
    req.flash("notice", "Sorry, the update process failed.")
    
    res.status(501).render("account/profile", {
      title: "Profile",
      nav,
      errors: null,
      firstName,
      lastName,
      email,
      account_password
    })
  }
}

/* ****************************************
*  Logout
* *************************************** */
accountController.accountLogout = async function (req, res) {
  res.clearCookie("jwt")
  req.flash("message", "You have been logged out.")
  res.redirect("/")
}

module.exports = accountController