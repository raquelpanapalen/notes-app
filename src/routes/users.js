const express = require('express');
const router = express.Router();

const { isAuthenticated } = require('../helpers/auth');
const User = require('../models/User');

const passport = require('passport');

//Rendering signin form
router.get('/users/signin', (req, res) => {
    res.render('users/signin');
});

//Post info from sign in page
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
    if (!name){
        errors.push({text: 'Please Insert your Userame'})
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

//Route to "Your profile" page
router.get('/users/profile/:id',isAuthenticated, async(req, res) => {
    const user = await User.findById(req.params.id);
    res.render('users/profile', {user});
});

//Route to render "Edit profile" form
router.get('/users/edit-profile/:id',isAuthenticated, async(req, res) => {
    const user = await User.findById(req.params.id);
    res.render('users/edit-profile', {user});
});


router.put('/users/edit-profile/:id', isAuthenticated, async (req, res) => {
    const {name, email, description} = req.body;
    const errors = [];
    //comprobar errores
    if (!name)
        errors.push({text: 'Please Insert your Username'})
    
    if (!description)
        errors.push({text: 'Please enter valid description'});

    const user = await User.findById(req.params.id);
    if (errors.length > 0){
        res.render('users/edit-profile', {
            errors,
            user
        });
    }
    else{
        await User.findByIdAndUpdate(req.params.id, {name, email, description});
        req.flash('success_msg', "Profile Updated Successfully");
        res.redirect('/users/profile/'+req.params.id);
    }
});

//Route to logout and redirect home
router.get('/users/logout', (req, res) => {
    req.logout();
    res.redirect('/');
});

module.exports = router;