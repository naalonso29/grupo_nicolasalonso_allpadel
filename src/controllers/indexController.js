const path = require('path');

const controller = {
    index: (req, res) => {
        res.render(path.resolve(__dirname, "..", "views", "users", "index"))
    },

    home_secundario: (req, res) => {
        res.render(path.resolve(__dirname, "..", "views", "products", "home_secundario"))
    },
}

module.exports = controller;