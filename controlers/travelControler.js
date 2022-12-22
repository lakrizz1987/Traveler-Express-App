const { Router } = require('express');

const Trip = require('../models/tripModel');
const service = require('../services/services');
const validator = require('validator');


const router = Router();

router.get('/', (req, res) => {
    try {
        res.render('home');
    } catch (error) {
        res.render('500');
    }

});

router.get('/search', async (req, res) => {
    try {
        let noTrips = false;
        const trips = await service.getAllTripsBySearch(req.query.search);

        if (trips.length < 1) {
            noTrips = true;
        };

        res.render('trips', { trips: trips, noTrips: noTrips })

    } catch (err) {

        res.render('trips', { err: err.message })
    }
})


router.get('/login', (req, res) => {
    try {
        res.render('login')

    } catch (error) {
        res.render('500')
    }
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
    try {
        res.clearCookie('SESSION');
        res.locals.user = {};
        res.locals.isLoged = false;
        res.status(200).redirect('/');
    } catch (error) {
        res.render('500');
    }

});


router.post('/register', async (req, res) => {

    const isStrongPass = validator.isStrongPassword(req.body.password,
        { minLength: 6, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 0 });

    try {
        if (!isStrongPass) {
            throw { message: 'Паролата трябва да е минимум 8 символа дълга, да садържа големи,малки букви и цифри!' }
        }

        const user = await service.registerUser(req.body);
        res.render('login')
    } catch (error) {
        res.render('register', { error })
    }
});


router.get('/register', (req, res) => {
    try {
        res.render('register')
        
    } catch (error) {
        res.render('500')
    }
});


router.get('/create', (req, res) => {
    try {
        res.render('create')
        
    } catch (error) {
        res.render('500')
    }
});


router.post('/create', (req, res) => {
    const trip = new Trip({ ...req.body, creator: req.user._id })

    trip.save()
        .then(() => res.redirect('/trips'))
        .catch((err) => res.status(500).redirect('/500'))
});


router.get('/trips', async (req, res) => {
    try {
        const trips = await service.getAllTrips();
        res.render('trips', { trips: trips });

    } catch (error) {
        res.render('500')
    };

});


router.get('/details/:_id', async (req, res) => {
    let isOwner = false;

    try {
        const searchedTrip = await service.getOneById(req.params._id);

        if (req.user) {
            isOwner = req.user._id == searchedTrip.creator;
        };

        res.render('details', { searchedTrip, isOwner });

    } catch (error) {
        res.render('500');
    };
});

router.get('/edit/:_id', async (req, res) => {
    try {
        const searchedTrip = await service.getOneById(req.params._id);
        res.render('edit', { searchedTrip });

    } catch (error) {
        res.render('500');
    };
});

router.post('/edit/:_id', async (req, res) => {
    try {
        const editedTrip = await service.getOneAndEdit(req.params._id, req.body);
        res.redirect(`/details/${req.params._id}`);

    } catch (error) {
        res.render('edit', { error });
    };
})


router.get('/delete/:_id', async (req, res) => {
    try {
        const deleted = await service.deleteOneById(req.params._id);
        res.redirect('/trips');

    } catch (error) {
        res.render('500');
    };
});

router.get('/404', (req, res) => {
    res.render('404');
});

router.get('/500', (req, res) => {
    res.render('500');
});

router.get('*', (req, res) => {
    res.render('404');
});


module.exports = router;