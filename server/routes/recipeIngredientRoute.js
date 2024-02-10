const express = require('express')
const { updateRecipeIngredient, getCheckedState } = require('../controllers/recipeIngredientController');

const router = express.Router();

router.put('/update-recipe-ingredient/:recipeIngredientId', updateRecipeIngredient);
router.get('/get-checked-state', getCheckedState);

module.exports = router;
