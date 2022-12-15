const { Router } = require('express');
const Trip = require('../models/tripModel');
const service = require('../services/services');

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

router.post('/create', (req, res) => {
    console.log(req.body)
    const trip = new Trip({ ...req.body })

    trip.save()
        .then(() => res.redirect('/trips'))
        .catch((err) => alert(err.message))
})

router.get('/trips', async (req, res) => {
    const trips = await service.getAllTrips();
    console.log(trips)
    res.render('trips', { trips: trips })
})


module.exports = router;