const pool = require("../database/")

/* ***************************
 *  Get all classification data
 * ************************** */
async function getClassifications(){
  return await pool.query("SELECT * FROM public.classification ORDER BY classification_name")
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
      WHERE i.classification_id = $1`,
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

module.exports = {getClassifications, getInventoryByClassificationId, getDetails, addClassification, getAllClassifications};