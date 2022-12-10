const express = require('express');
const { isLoggedIn } = require('../middleware/route-guard');
const router = express.Router(); // express Router we have to create this mini routers to export them

const Book = require('../models/Book.model')



/* GET books route  */


// ------- CRUD READ ----- //
// CREATE SHOULD BE THE FIRST BECAUSE WE HAVE THE ORDER OF CRUD --> CREATE 
router.get('/books/create', isLoggedIn, (req, res, next) => {
    try {
        res.render('books/book-create')
    } catch (error) {
        next(error)
    }
})

router.post('/books/create', isLoggedIn, async (req, res, next) => {
    try {
        // console.log(req.body);

        // deconstructing the proprieties of the request.body --> just to train!
        const { title, author, description, rating } = req.body;

        const createdBook = await Book.create(
            {
                title,
                author,
                description,
                rating
            }
        );

        console.log('A new book was created: ', createdBook.title);

        // after creatig the book, we redirect the user to the list of books 
        res.redirect('/books'); // goes to the other route!! --> or we would render in this re

    } catch (error) {
        next(error)
    }
})

// -------------- CRUD --> READ --------------- //
router.get("/books", async (req, res, next) => {

    try {

        const allBooks = await Book.find(); // find bring all books in the database  

        res.render("books/books-list", { books: allBooks });

    } catch (error) {
        next(error); // we have a middlware that handles our errors 
    }

});


router.get("/books/:bookID", isLoggedIn, async (req, res, next) => {
    try {

        const { bookID } = req.params
        const book = await Movie.findById(bookID);

        res.render('books/book-detail', book) // book is already an object so i dont need to pass it with curley bracket 


    } catch (error) {
        next(error)
    }
})


// ------------- CRUD UPDADE --------------- //

// when we have a slice other thing after :booksID is safe to put this code after the previous routes
router.get('/books/:bookID/edit', isLoggedIn, async (req, res, next) => {
    try {
        const { bookID } = req.params

        const book = await Book.findById(bookID);

        res.render('books/book-edit', book);

    } catch (error) {
        next(error)
    }
})


router.post('/books/:bookID/edit', isLoggedIn, async (req, res, next) => {
    try {

        const { bookID } = req.params;
        const { title, author, description, rating } = req.body;

        const updatedBook = await Book.findByIdAndUpdate(bookID,
            {
                title,
                author,
                description,
                rating
            });

        res.redirect(`/books/${bookID}`)
    } catch (error) {
        next(error)
    }
})


// ------- CRUD DELETE -------
router.post('/books/:bookID/delete', isLoggedIn, async (req, res, next) => {
    try {
        const { bookID } = req.params;

        await Book.findByIdAndDelete(bookID);

        res.redirect('/books')

    } catch (error) {
        next(error)
    }
})


module.exports = router;
