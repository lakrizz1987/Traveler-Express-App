const mongoose = require('mongoose');

function configMongoose(app){
    mongoose.connect(`mongodb+srv://lakrizz:T22bytlVfjTQH3ls@cubicles.osi7cn4.mongodb.net/?retryWrites=true&w=majority`);
    mongoose.set('strictQuery', true);

    const db = mongoose.connection;
    db.on('error',()=>console.log('Error!!!'));
    db.once('open',()=>console.log('Connected to DB...'));
}

module.exports = configMongoose;