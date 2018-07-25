const mongoose = require('mongoose');
const express = require('express')
const auth = require('../middleware/auth');
const _ = require('lodash');
const router = express.Router();
const {Movie, validate} = require('../models/movie');
const {Genre} = require('../models/genre');
//get the movies
router.get('/', async (req, res) => {
    const movie = await Movie.find()
    res.send(movie)
});
//create a movie
router.post('/', auth, async(req, res) => {
    const {error} = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    const name = await Movie.findOne({name : req.body.name});
    if (name) return res.status(400).send('movie name already exists');    
    const genre = await Genre.findById(req.body.genreId);
    if (!genre) return res.status(404).send('INvalid genre');
        const movie = new Movie({
        genre : {
            _id : genre._id,
            name : genre.name
        },
        title : req.body.title,
        name : req.body.name,
        numberInStock : req.body.numberInStock,
        dailyRentalRate: req.body.dailyRentalRate,
        })
    try {
        const result = await movie.save()
        res.send(result)
    }
    catch (e) {
        console.log(e.message)
    }   
    });
    //edit a movie
router.put('/:id', auth, async(req, res) => {
    const { error } = validate(req.body); 
    //validate the request body
    if (error) return res.status(400).send(error.details[0].message);
        const movie = await Movie.findByIdAndUpdate(req.params.id, {
            title : req.body.title,
            genre : {
                _id : genre._id,
                name : genre.name
            },
            name : req.body.name,
            numberInStock : req.body.numberInStock,
            dailyRentalRate: req.body.dailyRentalRate
    }, {new : true})
    if (!movie) return res.status(404).send('The Movie with the given ID was not found.');
    res.send(movie)    
    });
    
router.delete('/:id', auth, async(req, res) => {
    const movie = await Movie.findByIdAndRemove(req.params.id)
    if (!movie) return res.status(404).send('The Movie with the given ID was not found.');
        res.send(movie);
    });
    
router.get('/:id', async(req, res) => {
    const movie = await Movie.findById(req.params.id)
    if (!movie) return res.status(404).send('The Movie with the given ID was not found.');
        res.send(movie);
    });
module.exports = router;
