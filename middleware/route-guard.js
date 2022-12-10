// create two function that check if the user is loged in and another to check if is log out


// checks if the use is logged in when trying to access the login


// ---------ORIGINAL 
// const isLoggedIn = (req, res, next) => {
//     if (!req.session.currentUser) {
//         return res.redirect('/login')
//     }
//     next()
// }

const isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        return res.redirect('/login')
    }
    next()
}

// ---------ORIGINAL 
// const isLogedOut = (req, res, next) => {
//     if (req.session.currentUser) {
//         return res.redirect('/');
//     }

//     next()
// }

const isLogedOut = (req, res, next) => {
    if (req.isAuthenticated()) {
        return res.redirect('/');
    }

    next()
}

// when exporting more than one function we need to export an object with them 
module.exports = { isLoggedIn, isLogedOut };
