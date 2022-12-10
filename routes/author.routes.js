const express = require('express');
const router = express.Router();
const Author = require('../models/Author.model');
const Book = require('../models/Book.model');
const { isLoggedIn, isLogedOut } = require('../middleware/route-guard');
const fileUploader = require('../config/cloudinary.config');

// Create author ----> FOLOWING THE CRUD
router.get('/create', (req, res, next) => {
    try {
        res.render('author/author-create')
    } catch (error) {
        next(error)
    }
})


// fileUploader.single --> single because we are expecting a single file to be uploaded 

router.post('/create', fileUploader.single('picture_url'), async (req, res, next) => {
    try {
        // console.log('requested file', req.file)
        const { name, bio } = req.body;

        const author = {
            name,
            bio
        };

        // if (picture_url !== '') {
        //     author.picture_url = picture_url
        // }

        if (req.file) {
            author.picture_url = req.file.path
        }


        const newAuthor = await Author.create(author);

        console.log("Author created: ", newAuthor)

        res.redirect('/authors');

    } catch (error) {
        next(error)
    }
})


router.get('/', isLoggedIn, async (req, res, next) => {
    try {
        const authors = await Author.find()
        res.render('author/authors-list', { authors })
    } catch (error) {
        next(error)
    }
})


router.get('/:authorId', isLoggedIn, async (req, res, next) => {

    try {
        const { authorId } = req.params;

        const author = await Author.findById(authorId).populate('books');

        const { _id, name, bio, picture_url, books } = author;

        const booksList = await Book.find()


        res.render('author/author-details', {
            _id,
            name,
            bio,
            picture_url,
            books,
            booksList
        })

    } catch (error) {
        next(error)
    }

})


router.post('/:authorId/edit', isLoggedIn, async (req, res, next) => {
    try {
        const { authorId } = req.params;
        // console.log(req.body)

        const { books } = req.body;


        await Author.findByIdAndUpdate(authorId,
            {
                $push: { books: books }
            }
        );

        res.redirect(`/authors/${authorId}`)
    } catch (error) {

        next(error)
    }
})


// we allways need to export the router in order to use the route in the app
module.exports = router;
