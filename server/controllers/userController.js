const { hashPassword, comparePassword } = require('../helpers/password');
const UserModel = require('../models/userModel');
const jwt = require('jsonwebtoken')


const signup = async(req, res) => {
    try {
        const {name, email, password} = req.body;

        if(!name){
            return res.json({
                error: "Name is required"
            })
        }

        const emailExist = await UserModel.findOne({email});
        if(emailExist){
            return res.json({
                error: 'Email is taken already'
            })
        }

        if(!password || password.length < 6){
            return res.json({
                error: 'Password incorrect and should be at least 6 characters'
            })
        }

        const hashedPassword = await hashPassword(password);
        const user = await UserModel.create({
            name,
            email,
            password: hashedPassword
        });

        return res.json({
            user,
            message: 'Sign up successfully!'
        })
        
    } catch (error) {
        console.log(error)
    }
}
  
const signin = async(req, res) => {
    try {
        const {email, password} = req.body;

        const user = await UserModel.findOne({email});
        if(!user){
            return res.json({
                error: 'No user exist'
            })
        }

        const correctPassword = await comparePassword(password, user.password);
        if(correctPassword){
            jwt.sign({
                id: user._id,
                name: user.name,
                email: user.email
            }, process.env.JWT_SECRET, {}, (error, token) => {
                if(error) throw error
               res.cookie('token', token, { httpOnly: true })
                res.json({
                    user,
                    token,
                    message: 'Sign in successfully!'
                })
            })
        }

        if(!correctPassword){
            return res.json({
                error: 'Password don\'t match!'
            })
        }

    } catch (error) {
        console.log(error)
    }
}

const getUser = (req, res) => {

  const token = req.cookies.token;

    if(token){
        jwt.verify(token, process.env.JWT_SECRET, {}, (error, user) => {
            if(error)throw error;
            
            return res.json(user)
        })
    } else{
        return res.json(null)
    }
}

const signout = (req, res) => {
    try {
        res.clearCookie('token')
        .json({ 
            message: 'Sign out successfully!' 
        })
    } catch (error) {
        console.error(error)
    }
}


module.exports = {
    signup,
    signin,
    getUser,
    signout
}