const fs = require('fs');

function sinLoguear(req, res, next) {

    if (req.session.userLogged == undefined) {
        return res.redirect('/users/login')
    }

    next();
}

module.exports = sinLoguear;