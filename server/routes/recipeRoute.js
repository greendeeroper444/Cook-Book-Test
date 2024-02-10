const express = require('express')
const { addRecipe, deleteRecipe, getRecipes } = require('../controllers/recipeController');


const router = express.Router();

router.post('/add-recipe', addRecipe);
router.get('/get-recipe', getRecipes);
router.delete('/delete-recipe/:userId/:recipeId', deleteRecipe);


module.exports = router;