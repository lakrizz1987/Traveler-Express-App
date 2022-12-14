const express = require('express')
const configServer = require('./config/serverConfig');


const app = express();


app.listen(configServer.PORT, () => console.log(`Server is running on port ${configServer.PORT}...`));