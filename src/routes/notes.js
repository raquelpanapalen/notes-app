const express = require('express');
const router = express.Router();

const Note = require('../models/Note');
const { isAuthenticated } = require('../helpers/auth');

router.get('/notes/add', isAuthenticated, (req, res) => {
    res.render('notes/new-note');
});

//Post info from new note
router.post('/notes/new-note', isAuthenticated, async(req, res) => {
    const {title, description} = req.body;
    const errors = [];
    //Checking possible errors
    if (!title){
        errors.push({text: 'Please enter valid title'});
    }
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
     * await sth means that sth is an async process
     */
    else{
        const newNote = new Note({title, description});
        newNote.user = req.user.id;
        await newNote.save();
        req.flash('success_msg', "Note Added Successfully");
        res.redirect('/notes');
    }    
});

//Getting all notes by date
router.get('/notes', isAuthenticated, async (req, res) => {
    const notes = await Note.find({user: req.user.id}).sort({date: 'desc'});
    res.render('notes/all-notes', {notes});

});

//Rendering form to edit note
router.get('/notes/edit-note/:id', isAuthenticated, async (req, res) => {
    const note = await Note.findById(req.params.id);
    res.render('notes/edit-note', {note});
});

//Post info from editing note
router.put('/notes/edit-note/:id', isAuthenticated, async (req, res) => {
    const {title, description} = req.body;
    const errors = [];
    //checking possible errors
    if (!title){
        errors.push({text: 'Please enter valid title'});
    }
    if (!description)
        errors.push({text: 'Please enter valid description'});

    //if there are errors, render original note + errors
    const note = await Note.findById(req.params.id);
    if (errors.length > 0){
        res.render('notes/edit-note', {
            errors,
            note
        });
    }
    //Updating note w/ new parameters
    else{
        await Note.findByIdAndUpdate(req.params.id, {title, description});
        req.flash('success_msg', "Note Updated Successfully");
        res.redirect('/notes');
    }
});

//Deleting note
router.delete('/notes/delete/:id', isAuthenticated, async (req, res) => {
    await Note.findByIdAndDelete(req.params.id);
    req.flash('success_msg', "Note Deleted Successfully"); 
    res.redirect('/notes');
});

module.exports = router;