const mongoose = require('mongoose');
const _ = require('lodash');
const auth = require('../middleware/auth');
const express = require('express')
const router = express.Router();
const {Customer, validate} = require('../models/customer');
//get the customers and select the name only
router.get('/', async (req, res) => {
    const customer = await Customer.find().select({name:1})
    res.send(customer)
});
//create a customer
router.post('/', auth, async(req, res) => {
//validate the request body
const {error} = validate(req.body);
//if there is error return a 404 response with a message
if (error) return res.status(400).send(error.details[0].message);
        const customer = new Customer(_.pick(req.body, ['name', 'phone', 'isGold']));
        try {
            const result = await customer.save()
            res.send(result)
            }
    catch (e) {
        console.log(e.message)
    }   
    });
    //edit a customer
    router.put('/:id', async(req, res) => {
        const { error } = validate(req.body); 
        //validate the request body
        if (error) return res.status(400).send(error.details[0].message);
        const customer = await Customer.findByIdAndUpdate(req.params.id, {
        name : req.body.name,
        phone : req.body.phone,
        isGold : req.body.isGold
    }, {new : true})
    if (!Customer) return res.status(404).send('The Customer with the given ID was not found.');
    res.send(customer)    
    });
    //delete a customer
    router.delete('/:id', async(req, res) => {
        const customer = await Customer.findByIdAndRemove(req.params.id)
        if (!customer) return res.status(404).send('The Customer with the given ID was not found.');
        res.send(customer);
    });
    //get a single customer
    router.get('/:id', async(req, res) => {
        const customer = await Customer.findById(req.params.id)
        if (!customer) return res.status(404).send('The Customer with the given ID was not found.');
        res.send(customer);
    });
//export the router
module.exports = router;
