const mongoose = require('mongoose')
const config = require('config');
const express = require('express')
const Joi = require('joi');
const _ = require('lodash');
const bcrypt = require('bcrypt');
const router = express.Router();
const jwt = require('jsonwebtoken');
const {User} = require('../models/user');

    router.post('/', async (req, res) => {
        const {error} = validate(req.body);
        if (error) return res.status(400).send(error.details[0].message);
        //check if user is not already registered
            let user  = await User.findOne({email : req.body.email});
            //validate user, and return bad req if email is invalid
            if (!user) return res.status(400).send('invalid email or password');
            //validate the password
            const validatePassword = await bcrypt.compare(req.body.password, user.password);
            if(!validatePassword) return res.status(400).send('invalid email or password');
            //get the token
            const token = user.generateAuthToken();
            //send the token
            res.send(token);
    });
    //validate user
    function validate(req) {
        const schema = {
        email: Joi.string().min(10).required().email(),
        password: Joi.string().min(5).required()
        };
    
        return Joi.validate(req, schema);
    }
    module.exports = router;