const express = require('express');
const ApiService = require('../servicies/api.services');
const router = express.Router()

const apiService = new ApiService


// CREATE 
router.get('/create', (req, res, next) => {
    try {

        res.render('characters/character-create')

    } catch (error) {
        next(error)
    }
})


router.post('/create', async (req, res, next) => {
    try {

        const { name, occupation, weapon } = req.body

        // we add to the api a new character 
        await apiService.createCharacter({ name, occupation, weapon })

        res.redirect('/characters')

    } catch (error) {
        next(error)
    }
})

// READ 

router.get('/', async (req, res, next) => {
    try {

        const response = await apiService.getAllCharacters()

        const allCharacters = response.data

        res.render('characters/characters-list', { characters: allCharacters });
    } catch (error) {
        next(error)
    }
})





module.exports = router;