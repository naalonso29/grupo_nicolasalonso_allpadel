const path = require('path');

const controller = {
    detalleProducto: (req, res) => {
        res.render(path.resolve(__dirname, "..", "views", "products", "detail"))
    },
    carrito: (req, res) => {
        res.render(path.resolve(__dirname, "..", "views", "products", "cart"))
    },
    homeXCategoria: (req, res) => {
        res.render(path.resolve(__dirname, "..", "views", "products", "home_secundario"))
    },
    create: (req, res) => {
        res.render(path.resolve(__dirname, "..", "views", "products", "create"))
    },
    modify: (req, res) => {
        res.render(path.resolve(__dirname, "..", "views", "products", "modify"))
    }
}

module.exports = controller;