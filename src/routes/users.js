const express = require('express');
const router = express.Router();

const User = require('../models/User');

const passport = require('passport');

//Ruta para renderizar formulario
router.get('/users/signin', (req, res) => {
    res.render('users/signin');
});

//Ruta para recibir datos de signin
router.post('/users/signin', passport.authenticate('local', {
    successRedirect: '/notes',
    failureRedirect: '/users/signin',
    failureFlash: true
}));

//Ruta para renderizar formulario
router.get('/users/signup', (req, res) => {
    res.render('users/signup');
});

//Ruta para recibir datos de signup
router.post('/users/signup', async(req, res) => {
    const {name, email, password, confirm_password} = req.body;
    const errors = [];
    if (name.length <= 0){
        errors.push({text: 'Please Insert your Name'})
    }
    if (password != confirm_password){
        errors.push({text: 'Password do not match'});
    }
    if (password.length < 8){
        errors.push({text: 'Password must be at least 8 characters long'});
    }
    if (errors.length > 0){
        res.render('users/signup', {
            errors, 
            name,
            email, 
            password, 
            confirm_password
        });
    }
    else{
        //Looks for email coincidence
        const user = await User.findOne({email: email});
        if (user){
            //If coincidence found
            req.flash('error_msg', "You are already registered");
            res.redirect('/users/signup');
        }
        else {
            //If not a coincidence, create new user and save
            const newUser = new User({name, email, password});
            newUser.password = await newUser.encryptPassword(password);
            await newUser.save();
            req.flash('success_msg', "You are registered");
            res.redirect('/users/signin');
        }
    }
   
});

module.exports = router;