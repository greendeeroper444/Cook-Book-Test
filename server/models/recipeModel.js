const mongoose = require('mongoose')


const RecipeSchema = new mongoose.Schema({
    recipeName: { 
        type: String, 
        required: true 
    },
    ingredients: [{
        type: mongoose.Types.ObjectId,
        ref: 'RecipeIngredient',
    }],
    user:  { 
        type: mongoose.Types.ObjectId,
        ref: 'User' 
    },
})

const RecipeModel = mongoose.model('Recipe', RecipeSchema);
module.exports = RecipeModel;