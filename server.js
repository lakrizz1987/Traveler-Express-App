const express = require('express')
const configServer = require('./config/serverConfig');
const configHandlebars = require('./config/configHbs');

const app = express();
configHandlebars(app);

app.use(express.static('public'));
app.set('views', './view');

app.get('/', (req,res)=>{
    res.render('404')
})

app.listen(configServer.PORT, () => console.log(`Server is running on port ${configServer.PORT}...`));