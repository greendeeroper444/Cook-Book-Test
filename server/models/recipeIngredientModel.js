const mongoose = require('mongoose')

const RecipeIngredientSchema = new mongoose.Schema({
    recipe: {
        type: mongoose.Types.ObjectId,
        ref: 'Recipe',
    },
    ingredient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Ingredient',
        required: true,
    },
    user: {
        type: mongoose.Types.ObjectId,
        ref: 'User'
    },
    checked: {
        type: Boolean,
        default: false,
    },
})

const RecipeIngredientModel = mongoose.model('RecipeIngredient', RecipeIngredientSchema);

module.exports = RecipeIngredientModel;