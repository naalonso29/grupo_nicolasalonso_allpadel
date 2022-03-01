const fs = require('fs');

function esAdmin(req, res, next) {

    if (req.session.userLogged.administrador == false) {
        return res.redirect('/')
    }

    next();

}

module.exports = esAdmin;