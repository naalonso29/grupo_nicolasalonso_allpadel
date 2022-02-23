const path = require('path');

const controller = {
    login: (req, res) => {
        res.render(path.resolve(__dirname, "..", "views", "users", "login"))
    },
    register: (req, res) => {
        res.render(path.resolve(__dirname, "..", "views", "users", "register"))
    },
    profile: (req, res) => {
        res.render(path.resolve(__dirname, "..", "views", "users", "profile"))
    }
}

module.exports = controller;