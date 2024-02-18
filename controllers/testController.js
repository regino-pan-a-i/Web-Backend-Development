const utilities = require("../utilities")
const testController = {}


/* ***************************
 * Build test view
 * ***************************/

testController.error = async function(req, res){ 
    const nav = await utilities.getNav()
    let message = 'If you are loooking at this page, then the error route is not working.'
    res.render("./errors/test", {
      title: 'Test',
      message,
      // Break the nav for test purposes
    //   nav
    })
}

module.exports = testController;