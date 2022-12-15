const Trip = require('../models/tripModel');

async function getAllTrips(){
    const trips = await Trip.find({}).lean();

    return trips;
}

module.exports = {
    getAllTrips
}