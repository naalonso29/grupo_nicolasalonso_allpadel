const path = require('path')
const fs = require('fs')
const res = require('express/lib/response')

const model = {
    listar: () => JSON.parse(fs.readFileSync(path.resolve(__dirname, '..', 'data', 'products.json'))),
    mostrar: id => model.listar().find(e => e.id == id),
    mostrarXCategoria: function(categ) {
        let all = model.listar()
        let productos = []

        for (let i = 0; i < all.length; i++) {
            if (all[i].categoria == categ) {
                productos.push(all[i])
            }
        }

        return productos
    },
    guardar: data => {
        let all = model.listar()
        let id = all.length > 0 ? all[all.length - 1].id + 1 : 1
        let nombre = data.nombre
        let categoria = data.categoria
        let precio = data.precio
        let imagen = "/img/" + data.imagen
        let descripcion = data.descripcion
        let stock = data.stock
        let product = { id: id, nombre, categoria, precio, imagen, descripcion, stock }
        all.push(product)
        fs.writeFileSync(path.resolve(__dirname, '..', 'data', 'products.json'), JSON.stringify(all, null, 2))
    },
    modificar: (req, res) => {

        let productoAEditar = model.mostrar(req.params.id);

        productoAEditar.nombre = req.body.nombre;
        productoAEditar.categoria = req.body.categoria;
        productoAEditar.precio = req.body.precio;
        if (req.body.imagen != "") {
            productoAEditar.imagen = "/img/" + req.body.imagen;
        }
        productoAEditar.descripcion = req.body.descripcion;
        productoAEditar.stock = req.body.stock;

        let all = model.listar()

        for (let i = 0; i < all.length; i++) {
            if (all[i].id == req.params.id) {
                all[i] = productoAEditar;
            }
        }

        fs.writeFileSync(path.resolve(__dirname, '..', 'data', 'products.json'), JSON.stringify(all, null, 2));
    },

    borrar: (req, res) => {
        let idProductoAEliminiar = req.params.id;

        let all = model.listar();

        let productos = [];

        for (let i = 0; i < all.length; i++) {

            if (all[i].id != idProductoAEliminiar) {
                productos.push(all[i]);
            }

        }

        fs.writeFileSync(path.resolve(__dirname, '..', 'data', 'products.json'), JSON.stringify(productos, null, 2));

    }
}



module.exports = model