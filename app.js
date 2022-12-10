// ℹ️ Gets access to environment variables/settings
// https://www.npmjs.com/package/dotenv
require("dotenv").config();

// ℹ️ Connects to the database
require("./db");

// Handles http requests (express is node js framework)
// https://www.npmjs.com/package/express
const express = require("express");

// Handles the handlebars
// https://www.npmjs.com/package/hbs
const hbs = require("hbs");

const app = express();

// ℹ️ This function is getting exported from the config folder. It runs most pieces of middleware
require("./config")(app);
// import the new configuration file 
require("./config/session.config")(app);
// addind the passport cofiguration 
require("./config/passport.config")

// default value for title local
const capitalize = require("./utils/capitalize");
const projectName = "library-project";

app.locals.appTitle = `${capitalize(projectName)} created with IronLauncher`;

// 👇 Start handling routes here
const indexRoutes = require("./routes/index.routes");
app.use("/", indexRoutes);

// ROUTE TO SHOW THE DETAILS 
const booksRoutes = require("./routes/books.routes");
app.use("/", booksRoutes); // this is the starting point. the route was defined on the books.routes.js


// ADD THE AUTHORS ROUTES 
const authorRoutes = require('./routes/author.routes');
app.use('/authors', authorRoutes); // we are going to accumulate --> we will have /authors... then all the rest of the route

// ADD THE AUTH ROUTES 
const authRoutes = require('./routes/auth.routes');
app.use('/', authRoutes);

// ADD THE CHARACTERS ROUTE 
const charactersRoute = require('./routes/characters.routes');
app.use('/characters', charactersRoute);


// ❗ To handle errors. Routes that don't exist or errors that you handle in specific routes
require("./error-handling")(app);

module.exports = app;
