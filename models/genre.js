
const mongoose = require('mongoose');
const Joi = require('joi');
//create the genre schema
const genreSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true,
        validate : {
            validator : (v) => {v.length > 5},
            message : 'should be greater than 5'
        }
    }
})
//create the genre model
const Genre = mongoose.model('Genre', genreSchema);
//validate function
function validateGenre(genre) {
    const schema = {
    name: Joi.string().min(5).required()
    };

    return Joi.validate(genre, schema);
}
exports.Genre = Genre;
exports.validate = validateGenre;
exports.genreSchema = genreSchema;  
