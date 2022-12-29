const express = require('express')
const configServer = require('./config/serverConfig');
const configHandlebars = require('./config/configHbs');
const configMongoose = require('./config/configMongoose');
const router = require('./controlers/travelControler');

const cookieParser = require('cookie-parser');
const auth = require('./middlewares/auth');


const app = express();

configHandlebars(app);
configMongoose(app);

app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.set('views', './view');
app.use(cookieParser());
app.use(auth());

app.use(router);

let PORT = process.env.PORT || 5000

app.listen(PORT, () => console.log(`Server is running on port ${PORT}...`));