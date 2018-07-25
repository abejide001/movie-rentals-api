const mongoose = require('mongoose');
const Joi = require('joi');
//define the shape of the customer
const customerSchema = new mongoose.Schema({
    isGold : {
        type : Boolean,
        required : true
    },
    name : {
        type : String,
        required : true,
        minlength : 3,
        lowercase : true,
        trim : true
    },
    phone : {
        type : String,
        required : true,
        minlength : 0
    }
})
//create the model
const Customer = mongoose.model('Customer', customerSchema);
//validate the customer
function validateCustomer(customer) {
    //create a Schema that defines the shape
    const schema = {
    name: Joi.string().min(3).required(),
    phone: Joi.string().min(2).required(0),
    isGold: Joi.Boolean.required()
    };

    return Joi.validate(customer, schema);
}
exports.Customer = Customer;
exports.validate = validateCustomer;
