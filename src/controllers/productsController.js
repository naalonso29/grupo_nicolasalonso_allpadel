const path = require('path');

const controller = {
    detalleProducto: (req, res) => {
        res.render(path.resolve(__dirname, "..", "views", "products", "detail"))
    }
}

module.exports = controller;