const jwt = require('jsonwebtoken')
const UserModel = require('../models/userModel');
const IngredientModel = require('../models/ingredientModel');


const addIngredient = async(req, res) => {
    try {
        const {ingredientName} = req.body;

        const token = req.cookies.token;
        if(!token){
            return res.json({
                error: 'Unauthorized - Missing Token'
            })
        }

        jwt.verify(token, process.env.JWT_SECRET, {}, async(error, decodedToken) => {
            if(error) throw error;

            userId = decodedToken.id;

            const userExist = await UserModel.findById(userId);
            if(!userExist){
                return res.json({
                    error: 'User does not exist'
                })
            }

            const newIngredient = await IngredientModel.create({
                ingredientName,
                user: userId
            });

            return res.json({
                message: 'Ingredient created successfully!',
                newIngredient
            })
        })
    } catch (error) {
        console.log(error)
    }
}

const getIngredients = async(req, res) => {
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
                    error: 'User does not exist'
                })
            }

            const userIngredient = await IngredientModel.find({
                user: userId
            });

            return res.json(userIngredient)
        })
    } catch (error) {
        console.log(error)
    }
}

module.exports = {
    addIngredient,
    getIngredients
}