const path = require('path');

const controller = {
    index: (req, res) => {
        res.render(path.resolve(__dirname, "..", "views", "users", "index"), { usuarioLog: req.session.userLogged })
    }
}

module.exports = controller;