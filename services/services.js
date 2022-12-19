const Trip = require('../models/tripModel');
const User = require('../models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { SALT_ROUNDS, SECRET } = require('../config/serverConfig');


async function getAllTrips() {
    try {
        const trips = await Trip.find({}).lean();
        return trips;
    } catch (error) {
        throw { message: "Oops something is wrong!" }
    }

};

async function getAllTripsBySearch(name) {
    const trips = await getAllTrips()
    const result = trips.filter(trip => trip.name.toLowerCase().trim().includes(name.toLowerCase().trim()))
    return result
}

async function getOneById(id) {
    try {
        const searchedTrip = await Trip.findById(id).lean();
        return searchedTrip;

    } catch (error) {
        throw { message: "Oops something is wrong!" };
    }
};

async function deleteOneById(id) {
    try {
        const deletedTrip = await Trip.findByIdAndDelete(id);
        return deletedTrip;

    } catch (error) {
        throw { message: "Oops something is wrong!" }
    }
};


async function registerUser(data) {
    const { username, password, repeatPassword } = data;

    if (password != repeatPassword) {
        throw { message: 'Password mismatch!' };
    }

    const userNameExist = await User.findOne({ username: username }).lean() || false;

    if (userNameExist.username === username) {
        throw { message: 'Username allready exist!' };
    }

    bcrypt.genSalt(SALT_ROUNDS, function (err, salt) {
        if (err) {
            throw { message: 'Something is wrong!' };
        };

        bcrypt.hash(password, salt, function (err, hash) {
            if (err) {
                throw { message: 'Something is wrong!' };
            };

            const user = new User({ username: username, password: hash });
            user.save();
        });
    })

};

async function loginUser(data) {
    const { username, password } = data;

    const searchedUser = await User.findOne({ username: username });

    if (!searchedUser) throw { message: 'Wrong username or password!' };

    const isValidPass = await bcrypt.compare(password, searchedUser.password);

    if (isValidPass) {
        const token = jwt.sign({ _id: searchedUser._id }, SECRET);
        return token;
    } else {
        throw { message: 'Wrong username or password!' };
    }
}

module.exports = {
    getAllTrips,
    getAllTripsBySearch,
    getOneById,
    deleteOneById,
    registerUser,
    loginUser,

}