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
        throw { message: "Нещо се обърка, опитайте отново!" };
    }

};

async function getAllTripsBySearch(name) {
    const trips = await getAllTrips()
    const result = trips.filter(trip => trip.name.toLowerCase().trim().includes(name.toLowerCase().trim()))
    return result
}

async function getOneById(_id) {
    try {
        const searchedTrip = await Trip.findById(_id).lean();
        return searchedTrip;

    } catch (error) {
        throw { message: "Нещо се обърка, опитайте отново!" };
    }
};

async function getOneAndEdit(_id, updateValue) {
    try {
        const editedTrip = await Trip.findByIdAndUpdate(_id,updateValue);
        return editedTrip;
    } catch (error) {
        throw { message: "Нещо се обърка, опитайте отново!" };
    }
}

async function deleteOneById(id) {
    try {
        const deletedTrip = await Trip.findByIdAndDelete(id);
        return deletedTrip;

    } catch (error) {
        throw { message: "Нещо се обърка, опитайте отново!" };
    }
};


async function registerUser(data) {
    const { username, password, repeatPassword } = data;

    if (password != repeatPassword) {
        throw { message: 'Паролата не съвпада!' };
    }

    const userNameExist = await User.findOne({ username: username }).lean() || false;

    if (userNameExist.username === username) {
        throw { message: 'Потребителското име е заето!' };
    }

    bcrypt.genSalt(SALT_ROUNDS, function (err, salt) {
        if (err) {
            throw { message: "Нещо се обърка, опитайте отново!" };
        };

        bcrypt.hash(password, salt, function (err, hash) {
            if (err) {
                throw { message: "Нещо се обърка, опитайте отново!" };
            };

            const user = new User({ username: username, password: hash });
            user.save();
        });
    })

};

async function loginUser(data) {
    const { username, password } = data;

    const searchedUser = await User.findOne({ username: username });

    if (!searchedUser) throw { message: 'Грешно име или парола!' };

    const isValidPass = await bcrypt.compare(password, searchedUser.password);

    if (isValidPass) {
        const token = jwt.sign({ _id: searchedUser._id }, SECRET);
        return token;
    } else {
        throw { message: 'Грешно име или парола!' };
    }
}

module.exports = {
    getAllTrips,
    getAllTripsBySearch,
    getOneById,
    getOneAndEdit,
    deleteOneById,
    registerUser,
    loginUser,

}