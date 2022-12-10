module.exports = (req, res, next) => {
    res.locals.user = req.user;
    next();
}

// Every View will have access to the user inside a variable called user 