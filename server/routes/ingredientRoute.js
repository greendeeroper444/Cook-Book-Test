const express = require('express')
const { addIngredient, getIngredients } = require('../controllers/ingredientController');


const router = express.Router();

router.post('/add-ingredient', addIngredient);
router.get('/get-ingredient', getIngredients);

module.exports = router;