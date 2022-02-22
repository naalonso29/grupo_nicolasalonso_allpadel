const path = require('path');

const controller = {
    detalleProducto: (req, res) => {
        res.render(path.resolve(__dirname, "..", "views", "products", "detail"))
    },
    carrito: (req, res) => {
        res.render(path.resolve(__dirname, "..", "views", "products", "cart"))
    }
}

module.exports = controller;