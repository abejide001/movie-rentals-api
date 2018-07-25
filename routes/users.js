const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const auth = require('../middleware/auth');
const express = require('express');
const config = require('config')
const _ = require('lodash');
const bcrypt = require('bcrypt');
const router = express.Router();
const {User, validate} = require('../models/user');
    //get the current user
    router.get('/me', auth,  async(req, res) => {
        const user = await User.findById(req.user._id).select('name');
        res.send(user);
    })
    //create a user
    router.post('/', async (req, res) => {
        //validate the body of the request
        const {error} = validate(req.body);
        if (error) return res.status(400).send(error.details[0].message);
        //check if user is not already registered
            let user  = await User.findOne({email : req.body.email});
            if (user) return res.status(400).send('user already registered');
            user = new User(_.pick(req.body, ['name', 'email', 'password']));
            //generate salt
            const salt = await bcrypt.genSalt(10);
            //hash the password
            user.password = await bcrypt.hash(user.password, salt);
        await user.save();
        //generate the token
        const token = user.generateAuthToken();
        //set the respone header and pass the token 
        res.header('x-auth-token', token).send(_.pick(user, ['name', 'email']))
    });

    module.exports = router;
