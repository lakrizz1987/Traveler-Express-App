const handlebars = require('express-handlebars');

function configHandlebars(app){
    app.engine('hbs', handlebars.engine());
    app.set('view engine', 'hbs');
}

module.exports = configHandlebars;