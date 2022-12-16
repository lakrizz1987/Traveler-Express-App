const jwt = require('jsonwebtoken');
const { SECRET } = require('../config/serverConfig');

function auth() {
    return (req, res, next) => {
        let token = req.cookies['SESSION'];

        if (token) {
            jwt.verify(token, SECRET, function (err, decoded) {
                if (err) {
                    res.clearCookie('SESSION')
                } else {
                    req.user = decoded;
                    res.locals.user = decoded;
                    res.locals.isLoged = true;
                }
            });
        };

        next();
    };
};

module.exports = auth;