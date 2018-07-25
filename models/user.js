const jwt = require('jsonwebtoken');
const config = require('config');
const mongoose = require('mongoose');
const Joi = require('joi');
//create the user schema
const userSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true
    },
    email : {
        type : String,
        unique : true,
        lowercase : true,
        minlength : 6,
        maxlength : 200
    },
    password : {
        type : String,
        minlength : 5,
        maxlength : 1200
    },
    isAdmin : Boolean
})
userSchema.methods.generateAuthToken = function() { 
    const token = jwt.sign({ _id: this._id, isAdmin: this.isAdmin }, config.get('jwtPrivateKey'));
    return token;
}
const User = mongoose.model('User', userSchema);
//validate user
function validateUser(user) {
    const schema = {
    name: Joi.string().min(5).required(),
    email: Joi.string().min(10).required().email(),
    password: Joi.string().min(5).required()
    };

    return Joi.validate(user, schema);
}
exports.User = User;
exports.validate = validateUser;
