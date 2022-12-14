const { Router } = require('express');

const router = Router();

router.get('/', (req, res) => {
    res.render('home')
})

router.get('/login', (req, res) => {
    res.render('login')
})

router.get('/register', (req, res) => {
    res.render('register')
})

router.get('/create', (req, res) => {
    res.render('create')
})

router.get('/trips', (req, res) => {
    res.render('trips')
})


module.exports = router;