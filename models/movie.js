
const mongoose = require('mongoose');
const Joi = require('joi');
const {genreSchema} = require('./genre');
//create a schema
const movieSchema = new mongoose.Schema({
    //embedding the genre
    genre : {
        type : genreSchema,
        required : true
    },
    title : {
        type : String,
        required : true
    },
    numberInStock : {
        type : Number,
        required : true,
        min : 0
    },
    dailyRentalRate : {
        type: Number,
        required : true,
        min : 0
    }
})

const Movie = mongoose.model('Movie', movieSchema);

function validateMovie(movie) {
    //create a Schema that defines the shape
    const schema = {
    title: Joi.string().min(3).required(),
    genreId : Joi.string().required(),
    numberInStock: Joi.number().required(),
    dailyRentalRate : Joi.number().required()
    };

    return Joi.validate(movie, schema);
}
exports.Movie = Movie;
exports.validate = validateMovie;
