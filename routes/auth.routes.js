const express = require('express');
const router = express.Router()
const User = require('../models/User.model')
const bcryptjs = require('bcryptjs');
const mongoose = require('mongoose');
const passport = require('passport')
const saltRounds = 10;
const { isLoggedIn, isLogedOut } = require('../middleware/route-guard');






router.get('/signup', isLogedOut, async (req, res, next) => {
    try {
        res.render('auth/signup')
    } catch (error) {
        next(error)
    }
})


router.post('/signup', isLogedOut, async (req, res, next) => {
    try {

        const { username, email, password } = req.body;

        // a empty string is a falsy value !! 
        if (!username || !email || !password) { // server side validation 
            return res.render('auth/signup', {
                errorMessage: 'All fields are required!'
            });
        }

        // validade password
        const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/gm

        // if the password doenst match the regex rule
        if (!passwordRegex.test(password)) {
            return res.status(500).render('auth/signup',
                {
                    errorMessage: 'Password must contain at least 6 character and must contain one Uppercase letter, one lowercase letter and one number'
                })
        }

        const salt = await bcryptjs.genSalt(saltRounds);
        const passwordHash = await bcryptjs.hash(password, salt);

        await User.create(
            {
                username,
                email,
                passwordHash
            }
        )

        res.redirect('/profile');

    } catch (error) {
        if (error instanceof mongoose.Error.ValidationError) {
            return res.status(500).render('auth/signup', { errorMessage: error.message })
        } else if (error.code === 11000) {
            return res.status(500).render('auth/signup', { errorMessage: 'Username or email already in use!' })
        } else {
            next(error)
        }

    }
})


router.get('/profile', isLoggedIn, async (req, res, next) => {
    try {
        // get the current user from the session 
        // const { currentUser } = req.session; // we dont need to send the user anymore Since we bind it! 
        // res.render('auth/profile', currentUser)
        res.render('auth/profile')

    } catch (error) {
        next(error)
    }
})



// login 
router.get('/login', isLogedOut, async (req, res, next) => {
    try {
        res.render('auth/login')
    } catch (error) {
        next(error)
    }
})


router.post('/login', isLogedOut, async (req, res, next) => {
    const { email, password } = req.body;

    // now after the configuration of the session in config/session.config we have this in the req
    // console.log('----> SESSION', req.session)
    if (email === '' || password === '') {
       return res.render('auth/login', {
            errorMessage: 'Please enter both email and password'
        })
    }

    passport.authenticate('local', (error, user, failureDetails) => {
        if (error) {
            //
            return next(error)
        }

        if (!user) {
            return res.render('auth/login', {
                errorMessage: 'Wrong passord or username'
            });
        }

        req.login(user, error => {
            if (error) {
                return next(error);
            }

            // everythnng went good
            res.redirect('/profile');

        })
    }

    )(req, res, next)


})

// ------------ ORIGINAL LOGIN ROUTE // ------------ 

// router.post('/login', isLogedOut, async (req, res, next) => {
//     try {
//         const { email, password } = req.body;

//         // now after the configuration of the session in config/session.config we have this in the req
//         // console.log('----> SESSION', req.session)
//         if (email === '' || password === '') {
//             res.render('auth/login', {
//                 errorMessage: 'Please enter both email and password'
//             })
//         }

//         const user = await User.findOne({ email });

//         if (!user) {
//             res.render('auth/login', {
//                 errorMessage: 'Email is not registered. Please try another email.'
//             });
//             // checking if the password is matches
//         } else if (bcryptjs.compareSync(password, user.passwordHash)) {
//             // rendering the user to the profile view 


//             // attaching the user to the session
//             req.session.currentUser = user;
//             // not needed after adding req.session.currentUser = user
//             // res.render('auth/profile', user);
//             res.redirect('/profile');
//         } else {
//             res.render('auth/login', { errorMessage: 'Incorrect password' })
//         }


//     } catch (error) {
//         next(error)
//     }
// })



// CREATE A LOGOUT ROUT
// router.post('/logout', (req, res, next) => {
//     // destoing the session wen log out is pressed 
//     req.session.destroy((error) => {
//         if (error) {
//             next(error)
//         }

//         res.redirect('/')
//     })
// })


router.post('/logout', (req, res, next) => {
    // destoing the session wen log out is pressed 
    req.logout(error => {
        if (error) {
            next(error);
        }

        res.redirect('/')
    });
});



// ROUTES FOR GOOGLE AUTHentication
router.get('/auth/google', passport.authenticate('google', {
    scope: ['profile', 'email']
})
);

router.get('/auth/google/callback', passport.authenticate('google', {
    successRedirect: `${process.env.APP_HOSTNAME}/profile`,
    failureRedirect: `${process.env.APP_HOSTNAME}/login`
}))



module.exports = router;