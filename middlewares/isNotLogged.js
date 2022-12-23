function isNotLogged(req, res, next) {
    if (!req.user) {
        res.redirect('/login');
        return;
    }
    next()
};

module.exports = isNotLogged;