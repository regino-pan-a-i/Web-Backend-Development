const pool = require("../database/")

/* ***************************
 *  Get all classification data
 * ************************** */
async function getClassifications(){
  return await pool.query(`SELECT DISTINCT c.* FROM classification AS c
  JOIN inventory AS i
  ON c.classification_id = i.classification_id
  WHERE c.classification_approved = true and inv_approved = true
  ORDER BY c.classification_name`)
}

/* ***************************
 *  Get all inventory items and classification_name by classification_id
 * ************************** */
async function getInventoryByClassificationId(classification_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory AS i 
      JOIN public.classification AS c 
      ON i.classification_id = c.classification_id 
      WHERE i.classification_id = $1 AND i.inv_approved = true`,
      [classification_id]
    )
    return data.rows
  } catch (error) {
    console.error("getclassificationsbyid error " + error)
  }
}

/* ***************************
 * Get details for a single car
 * ***************************/

async function getDetails(car_id){
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory AS i 
      JOIN public.classification AS c 
      ON i.classification_id = c.classification_id 
      WHERE i.inv_id = $1`,
      [car_id]
    )
    return data.rows[0]
  } catch (error) {
    console.error("getDetails error " + error)
  }
}

/* ***************************
 * Add new classification
 * ***************************/
async function addClassification(classification_name){
  try {
    await pool.query(
      `INSERT INTO classification (classification_name) VALUES ($1)`,
      [classification_name]
    )}
  catch(error){
    console.error("addClassification error " + error)
  }
}

/* ***************************
 * Get All Classifications
 * ***************************/

async function getAllClassifications(){
  try {
    const data = await pool.query(
      `SELECT * FROM classification`
      )
      return data.rows
    } catch (error) {
      console.error("getAllClassifications error " + error)
    }
  }
/* ***************************
  * Add new inventory
  * ***************************/
async function addInventory(inv_make, inv_model, inv_year, inv_description,inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id){
  try {
    await pool.query(
      `INSERT INTO inventory (inv_make, inv_model, inv_year, inv_description,inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
      [inv_make, inv_model, inv_year, inv_description,'/images/vehicles/no-image.png', '/images/vehicles/no-image-tn.png', inv_price, inv_miles, inv_color, classification_id]
    )}
  catch(error){
    console.error("addInventory error " + error)
  }
}

/* ***************************
  * Update new inventory
  * ***************************/
async function updateInventory(inv_id,  
  inv_make,
  inv_model,
  inv_description,
  inv_image,
  inv_thumbnail,
  inv_price,
  inv_year,
  inv_miles,
  inv_color,
  classification_id){
  try {
    const sql =
      "UPDATE public.inventory SET inv_make = $1, inv_model = $2, inv_description = $3, inv_image = $4, inv_thumbnail = $5, inv_price = $6, inv_year = $7, inv_miles = $8, inv_color = $9, classification_id = $10 WHERE inv_id = $11 RETURNING *"
    const data = await pool.query(sql, [
      inv_make,
      inv_model,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_year,
      inv_miles,
      inv_color,
      classification_id,
      inv_id
    ])
    return data.rows[0]
  } catch (error) {
    console.error("model error: " + error)
  }
}

/* ***************************
 *  Delete Inventory Item
 * ************************** */
async function deleteInventory(inv_id) {
  try {
    const sql = 'DELETE FROM inventory WHERE inv_id = $1'
    const data = await pool.query(sql, [inv_id])
  return data
  } catch (error) {
    new Error("Delete Inventory Error")
  }
}

/* ***************************
 *  Find classification that need approval
 * ************************** */
async function getClassificationsToApprove(){
  try {
    const data = await pool.query(
      `SELECT * FROM public.classification WHERE classification_approved = false`
    )

    return data.rows
  } catch (error) {
    console.error("getClassificationsToApprove error " + error)
  }
}

/* ***************************
 *  Find inventory that need approval
 * ************************** */
async function getInventoryToApprove(){
  try {
    const data = await pool.query(
      `SELECT * FROM inventory  AS i
      JOIN classification AS c
      ON i.classification_id = c.classification_id
      WHERE inv_approved = false`
    )

    return data.rows
  } catch (error) {
    console.error("getinventorysToApprove error " + error)
  }
}

/* ***************************
 *  Approve Inventory
 * ************************** */
async function approveInventory(inv_id, account_id){
  try {
    const data = await pool.query(
      `UPDATE public.inventory
      SET inv_approved = true, account_id = $1
      WHERE inv_id = $2`,
      [account_id, inv_id]
    )
    return data
  } catch (error) {
    console.error("approveInventory error " + error)
  }

}

/* ***************************
 *  Approve Classification
 * ************************** */
async function approveClassification(classification_id, account_id){
  try {
    const data = await pool.query(
      `UPDATE public.classification 
      SET classification_approved = true, account_id = $1  
      WHERE classification_id = $2`,
      [account_id,classification_id]
    )
    return data
  } catch (error) {
    console.error("approveInventory error " + error)
  }

}

module.exports = {getClassifications, getInventoryByClassificationId, getDetails, 
  addClassification, getAllClassifications, addInventory, updateInventory, deleteInventory, 
  getClassificationsToApprove, getInventoryToApprove, approveInventory, approveClassification};