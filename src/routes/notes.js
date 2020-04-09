const express = require('express');
const router = express.Router();

const Note = require('../models/Note');

router.get('/notes/add', (req, res) => {
    res.render('notes/new-note');
});

router.post('/notes/new-note', async(req, res) => {
    const {title, description} = req.body;
    const errors = [];
    if (!title)
        errors.push({text: 'Please enter valid title'});
    
    if (!description)
        errors.push({text: 'Please enter valid description'});
    
    if (errors.length > 0){
        res.render('notes/new-note', {
            errors,
            title,
            description
        });
    }
    /* Save data in database 
     * await _____  indica que _____ es un proceso asíncrono
     */
    else{
        const newNote = new Note({title, description});
        await newNote.save();
        res.redirect('/notes');
    }    
});

router.get('/notes', (req, res) => {
    





});

module.exports = router;