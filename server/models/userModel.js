const mongoose = require('mongoose')


const UserChema = new mongoose.Schema({
    name: String,
    email: {
        type: String,
        unique: true
    },
    password: String
})

const UserModel = mongoose.model('User', UserChema);
module.exports = UserModel;