const { Router } = require('express');

const Trip = require('../models/tripModel');
const service = require('../services/services');
const validator = require('validator');

const router = Router();

router.get('/', (req, res) => {
    res.render('home');
});

router.get('/search', async (req, res) => {
    try {
        const trips = await service.getAllTripsBySearch(req.query.search);
        res.render('trips', { trips: trips })
        
    } catch (err) {
        
        res.render('trips', { err : err.message })
    }
})


router.get('/login', (req, res) => {
    res.render('login')
});


router.post('/login', async (req, res) => {
    try {
        const token = await service.loginUser(req.body);
        res.cookie('SESSION', token);
        res.redirect('/trips');

    } catch (error) {
        res.render('login', { error })
    }
});


router.get('/logout', (req, res) => {
    res.clearCookie('SESSION');
    res.locals.user = {};
    res.locals.isLoged = false;
    res.status(200).redirect('/');
});


router.post('/register', async (req, res) => {

    const isStrongPass = validator.isStrongPassword(req.body.password,
        { minLength: 6, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 0 });

    try {
        if (!isStrongPass) {
            throw { message: 'Password must be minimum 8 characters long and contain uppercase and lowercase letters and numbers' }
        }

        const user = await service.registerUser(req.body);
        res.render('login')
    } catch (error) {
        res.render('register', { error })
    }
});


router.get('/register', (req, res) => {
    res.render('register')
});


router.get('/create', (req, res) => {
    res.render('create')
});


router.post('/create', (req, res) => {
    const trip = new Trip({ ...req.body, creator: req.user._id })

    trip.save()
        .then(() => res.redirect('/trips'))
        .catch((err) => res.status(404).redirect('/404'))
});


router.get('/trips', async (req, res) => {
    const trips = await service.getAllTrips();
    res.render('trips', { trips: trips })
});


router.get('/details/:id', async (req, res) => {
    let isOwner = false;

    try {
        const searchedTrip = await service.getOneById(req.params.id);

        if (req.user) {
            isOwner = req.user._id == searchedTrip.creator;
        };

        res.render('details', { searchedTrip, isOwner });

    } catch (error) {
        res.status(404).redirect('/404');
    };
});


module.exports = router;