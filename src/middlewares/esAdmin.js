const fs = require('fs');

function esAdmin(req, res, next) {

    if (req.session.userLogged.esAdmin == "Comprador") {
        return res.redirect('/')
    }

    next();

}

module.exports = esAdmin;