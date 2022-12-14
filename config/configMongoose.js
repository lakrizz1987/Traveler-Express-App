const mongoose = require('mongoose');

function configMongoose(app){
    mongoose.connect(`mongodb+srv://trips:trips123@cluster0.pcxzblb.mongodb.net/?retryWrites=true&w=majority`);
    mongoose.set('strictQuery', true);

    const db = mongoose.connection;
    db.on('error',()=>console.log('Error!!!'));
    db.once('open',()=>console.log('Connected to DB...'));
}

module.exports = configMongoose;