
const jwt = require('jsonwebtoken')
const UserModel = require('../models/userModel');
const RecipeIngredientModel = require('../models/recipeIngredientModel');

const updateRecipeIngredient = async(req, res) => {
    try {
        const {recipeIngredientId} = req.params;
        const {checked} = req.body;

        const token = req.cookies.token;
        if(!token){
            return res.json({
                error: 'Unauthorized - Missing Token'
            })
        }

        jwt.verify(token, process.env.JWT_SECRET, {}, async(error, decodedToken) => {
           if(error)throw error;

            const userId = decodedToken.id;

            const userExist = await UserModel.findById(userId);
            if(!userExist){
                return res.json({
                    error: 'User does not exist'
                })
            }

            const updatedIngredient = await RecipeIngredientModel.findByIdAndUpdate(
                recipeIngredientId,
                { checked },
                { new: true }
            );

            if(!updatedIngredient){
                return res.json({
                    error: 'Selected ingredient not found',
                })
            }

            return res.json(updatedIngredient);
        })
    } catch (error) {
        console.log(error)
    }
}

const getCheckedState = async(req, res) => {
    try {
        const token = req.cookies.token;
        if(!token){
            return res.json({
                error: 'Unauthorized - Missing Token',
            })
        }

        jwt.verify(token, process.env.JWT_SECRET, {}, async(error, decodedToken) => {
            if(error)throw error;

            const userId = decodedToken.id;

            const userExist = await UserModel.findById(userId);
            if(!userExist){
                return res.json({
                    error: 'User does not exist'
                })
            }

            const checkedIngredients = await RecipeIngredientModel.find({ 
                user: userId 
            }, '_id checked');

            return res.json(checkedIngredients)
        })
    } catch (error) {
        console.log(error)
    }
}

  
module.exports = {
    updateRecipeIngredient,
    getCheckedState
}
