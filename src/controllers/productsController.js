const path = require('path');
const product = require('../models/product')
const fs = require('fs');

const controller = {
    detalleProducto: (req, res) => {
        res.render(path.resolve(__dirname, "..", "views", "products", "detail"), { producto: product.mostrar(req.params.id) })
    },
    carrito: (req, res) => {
        res.render(path.resolve(__dirname, "..", "views", "products", "cart"))
    },
    home_secundario: (req, res) => {
        res.render(path.resolve(__dirname, "..", "views", "products", "home_secundario"), { productos: product.listar() })
    },
    homeXCategoria: (req, res) => {
        res.render(path.resolve(__dirname, "..", "views", "products", "home_secundario"), { productos: product.mostrarXCategoria(req.params.categoria) })
    },
    create: (req, res) => {
        res.render(path.resolve(__dirname, "..", "views", "products", "create"))
    },
    modify: (req, res) => {
        res.render(path.resolve(__dirname, "..", "views", "products", "modify"), { producto: product.mostrar(req.params.id) })
    },
    crearProducto: (req, res) => {
        product.guardar(req.body);

        res.redirect("/")
    },
    modificarProducto: (req, res) => {

        product.modificar(req, res);

        let urlARedireccionar = '/products/detail/' + req.params.id;

        res.redirect(urlARedireccionar);
    },
    borrarProducto: (req, res) => {

        let productoAEliminar = product.mostrar(req.params.id)

        let urlARedireccionar = '/products/lista/' + productoAEliminar.categoria;

        product.borrar(req, res);

        res.redirect(urlARedireccionar);
    }

}

module.exports = controller;