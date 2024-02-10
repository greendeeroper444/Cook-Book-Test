const jwt = require('jsonwebtoken')
const UserModel = require('../models/userModel');
const RecipeModel = require('../models/recipeModel');
const RecipeIngredientModel = require('../models/recipeIngredientModel');


const addRecipe = async(req, res) => {
    try {
        const {recipeName, ingredients} = req.body;

        const token = req.cookies.token;
        if(!token){
            return res.json({
                error: 'Unauthorized -  Missing Token'
            })
        }

        jwt.verify(token, process.env.JWT_SECRET, {}, async(error, decodedToken) => {
            if(error) throw error;

            const userId = decodedToken.id;

            const userExist = await UserModel.findById(userId)
            if(!userExist){
                return res.json({
                    error: 'User does not exist'
                })
            }

             //create instances of RecipeIngredientModel
            const recipeIngredients = await RecipeIngredientModel.create(
                ingredients.map((ingredientId) => ({
                  ingredient: ingredientId,
                  user: userId,
                  checked: false, 
                }))
            );
    
            const newRecipe = await RecipeModel.create({
                recipeName,
                ingredients: recipeIngredients,
                user: userId,
            });
    
            //update the recipe with recipe ingredients
            newRecipe.ingredients = recipeIngredients;
            await newRecipe.save();
            

            return res.json({
                message: 'Recipe created successfully!',
                newRecipe
            })
        })
    } catch (error) {
        console.log(error)
    }
}

const getRecipes = async(req,res) => {
    try {
        const token = req.cookies.token;
        if(!token){
            return res.json({
                error: 'Unauthorized - Missing Token'
            })
        }

        jwt.verify(token, process.env.JWT_SECRET, {}, async(error, decodedToken) => {
            if(error) throw error;

            const userId = decodedToken.id;

            const userExist = await UserModel.findById(userId);
            if(!userExist){
                return res.json({
                    error: 'User does not exist!'
                })
            }

            const userRecipes = await RecipeModel.find({ user: userId })
            .populate({
              path: 'ingredients',
              model: 'RecipeIngredient',
              populate: {
                path: 'ingredient',
                model: 'Ingredient',
              },
            });
           
            return res.json(userRecipes);
        })
    } catch (error) {
        console.log(error)
    }
}


const deleteRecipe = async(req, res) => {
    try {
        const token = req.cookies.token;

        if(!token){
            return res.json({
                error: 'Unauthorized - Missing Token'
            })
        }

        jwt.verify(token, process.env.JWT_SECRET, {}, async(error, decodedToken) => {
            if(error) throw error;

            const userId = decodedToken.id;

            const userExist = await UserModel.findById(userId)
            if(!userExist){
                return res.json({
                    error: 'User does not exist'
                })
            }

            const recipeId = req.params.recipeId
            const recipe = await RecipeModel.findOne({
                _id: recipeId,
                user: userId,
            }).populate('ingredients');

            if(!recipe){
                return res.json({
                    error: 'Recipe not found'
                })
            }

            //to remove recipe
            await RecipeModel.deleteOne({
                _id: recipeId,
                user: userId
            });

            //remove the associated selected ingredients
            for(const ingredient of recipe.ingredients){
                await RecipeIngredientModel.deleteOne({
                  _id: ingredient._id,
                });
            };

            return res.json({
                message: 'Recipe deleted successfully!'
            })
        })
    } catch (error) {
        console.log(error)
    }
}

module.exports = {
    addRecipe,
    getRecipes,
    deleteRecipe,
}