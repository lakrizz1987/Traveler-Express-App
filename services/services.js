const Trip = require('../models/tripModel');
const User = require('../models/userModel');
const bcrypt = require('bcrypt');
const { SALT_ROUNDS, SECRET } = require('../config/serverConfig');


async function getAllTrips() {
    const trips = await Trip.find({}).lean();

    return trips;
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

            const user = new User({ username: username, password: hash});
            user.save();
        });
    })

};

module.exports = {
    getAllTrips,
    registerUser
}