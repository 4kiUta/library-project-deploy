const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const User = require('../models/User.model');
// we are importing the bcrypt for the local straegy 


// THIS ARE ALLWAYS NEEDED INDEPENDET OF THE AUTHENTICATION STRATEGY WE ARE USING !!! 
// set the user in the session 
passport.serializeUser((loggedInUser, callback) => {
    callback(null, { _id: loggedInUser._id, username: loggedInUser.username })
});

// Allows access to the user in req.user
passport.deserializeUser((userIdFromSession, callback) => {
    User.findById(userIdFromSession, (error, userDocument) => {
        if (error) {
            callback(error);
            return;
        }
        callback(null, userDocument);
    })
});


// LOCAL STRATEGY 
passport.use(
    new LocalStrategy({
        // these two fields are related to the form in the view
        // FIELDS USED IN THE LOGGIN FORM 
        usernameField: 'email', // the field I want to use as my loggin. the default is the usernma
        passwordField: 'password', // 
    },
        async (email, password, done) => {
            try {
                const user = await User.findOne({ email });
                if (!user) {
                    return done(null, false, { message: 'Incorrect Email.' })
                }

                if (!bcrypt.compareSync(password, user.passwordHash)) {
                    return done(null, false, { message: 'Incorrect Password.' })
                }

                done(null, user);
            } catch (error) {
                done(error);
            }
        }
    )
);

// PASSPORT - GOOGLE STRATEGY
passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: '/auth/google/callback' // http://localhost:3000/auth/google/callback
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                const user = await User.findOne({ googleId: profile.id })
                if (user) {
                    return done(null, user)
                }
            } catch (error) {
                done(error)
            }

            // second try catch in case i dont have an user i want to create another one right at that moment 
            try {
                const newUser = await User.create({
                    googleId: profile.id,
                    username: profile.displayName
                });
                // Authenticate 
                done(null, newUser)
            } catch (error) {
                done(error)
            }
        }

    )
);

// done(null, user , message to pass)
// done is a internal function
// the first parameter is the error, the second the error 