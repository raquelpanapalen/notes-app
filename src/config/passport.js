const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const User = require('../models/User');

//Autenticar usuario
//El callback done sirve para finalizar el proceso
passport.use(new LocalStrategy({
    usernameField: 'email'
}, async (email, password, done) => {
    //Match user email
    const user = await User.findOne({email: email});
    if (!user){
        return done(null, false, {message: 'User Not Found'});
    } else{
        //Match user password
        const match = await user.matchPassword(password);
        if (match){
            return done(null, user);
        } else {
            return done(null, false, {message: 'Incorrect password'});
        }
    }
}));

//Almacenar id user al hacer login
passport.serializeUser((user, done) => {
    done(null, user.id);
});

//A través de un id obtenemos el user
passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
        done(err, user);
    });
});