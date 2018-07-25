const validateId = require('../middleware/validateObjectId');
const mongoose = require('mongoose')
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const express = require('express')

const router = express.Router();

const {Genre, validate} = require('../models/genre');
//get all genres
  router.get('/', async (req, res) => {
        try {
        const genres = await Genre.find()
            res.send(genres)
        }
        catch(e) {
          res.status(500).send(e.message)
        }
  });
  //create a genre
  router.post('/', auth, async(req, res) => {
    //validate the body of the request
    const {error} = validate(req.body);
    //check if a genre name exist
    const name = await Genre.findOne({name : req.body.name})
    if (name) return res.status(400).send('genre name already exists');
    if (error) return res.status(400).send(error.details[0].message);
          const genre = new Genre({
              name : req.body.name
          })
          try {
            const result = await genre.save()
          res.send(result)
          }
        catch (e) {
          console.log(e.message)
        }   
    });
    //edit a genre
    router.put('/:id', async(req, res) => {
    const { error } = validate(req.body); 
    //validate the request body
    if (error) return res.status(400).send(error.details[0].message);
    const genre = await Genre.findByIdAndUpdate(req.params.id, {
      name : req.body.name
    }, {new : true})
    if (!genre) return res.status(404).send('The genre with the given ID was not found.');
    res.send(genre)    
  });
    //delete a genre
    router.delete('/:id', [auth, admin], async(req, res) => {
      const genre = await Genre.findByIdAndRemove(req.params.id)
    if (!genre) return res.status(404).send('The genre with the given ID was not found.');
      res.send(genre);
  });
  //get a single genre
  router.get('/:id', validateId, async(req, res) => {
    const genre = await Genre.findById(req.params.id)
    if (!genre) return res.status(404).send('The genre with the given ID was not found.');
    res.send(genre);
  });
  
    //export the router
    module.exports = router;
