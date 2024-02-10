const mongoose = require('mongoose')


const IngredientSchema = new mongoose.Schema({
    ingredientName:{
        type: String,
        require: true
    },
    user: {
        type: mongoose.Types.ObjectId,
        ref: 'User'
    }
})

const IngredientModel = mongoose.model('Ingredient', IngredientSchema);
module.exports = IngredientModel;