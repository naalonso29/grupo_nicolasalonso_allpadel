const path = require('path');
const product = require('../models/product')
const fs = require('fs');
const db = require('../../database/models');

const controller = {
    detalleProducto: (req, res) => {

        db.products.findOne({
                where: { idproducto: req.params.id },
                attributes: ['idproducto', 'nombre', 'precio', 'descripcion', 'imagen', 'stock'],
                include: [{ association: "colores" }, { association: "marcas" }, { association: "formas" }]
            })
            .then(datos => {
                res.render(path.resolve(__dirname, "..", "views", "products", "detail"), { producto: datos, usuarioLog: req.session.userLogged })
            }).catch(error => res.send(error))

    },
    carrito: (req, res) => {
        res.render(path.resolve(__dirname, "..", "views", "products", "cart"), { usuarioLog: req.session.userLogged })
    },
    itemsCategoria: (req, res) => {
        let sql = ""

        switch (req.params.categoria) {
            case 'marcas':
                sql = "SELECT idmarca as id, nombre, imagen, 'marcas' as nombrecategoria FROM brands";
                break;
            case 'colores':
                sql = "SELECT idcolor as id, nombre, imagen, 'colores' as nombrecategoria FROM colors";
                break;
            case 'formas':
                sql = "SELECT idforma as id, nombre, imagen, 'formas' as nombrecategoria FROM forms";
                break;
        }

        if (sql != "") {
            db.sequelize.query(sql, { type: db.sequelize.QueryTypes.SELECT })
                .then(datos => {
                    res.render(path.resolve(__dirname, "..", "views", "products", "home_categorias"), { categoria: datos, usuarioLog: req.session.userLogged })
                })
        } else {
            res.send("NO EXISTE ESA CATEGORIA")
        }

    },
    home_secundario: (req, res) => {
        db.products.findAll({
                attributes: ['idproducto', 'nombre', 'imagen', 'precio']
            })
            .then(datos => {
                res.render(path.resolve(__dirname, "..", "views", "products", "home_secundario"), { productos: datos, usuarioLog: req.session.userLogged })
            })
    },
    home_lista_categoria: (req, res) => {

        switch (req.params.categoria) {
            case 'marcas':
                db.products.findAll({
                        where: { marcasIdmarca: req.params.id },
                        attributes: ['idproducto', 'nombre', 'imagen', 'precio']
                    })
                    .then(datos => {
                        res.render(path.resolve(__dirname, "..", "views", "products", "home_secundario"), { productos: datos, usuarioLog: req.session.userLogged })
                    })
                break;
            case 'colores':
                db.products.findAll({
                        where: { coloresIdcolor: req.params.id },
                        attributes: ['idproducto', 'nombre', 'imagen', 'precio']
                    })
                    .then(datos => {
                        res.render(path.resolve(__dirname, "..", "views", "products", "home_secundario"), { productos: datos, usuarioLog: req.session.userLogged })
                    })
                break;
            case 'formas':
                db.products.findAll({
                        where: { formasIdforma: req.params.id },
                        attributes: ['idproducto', 'nombre', 'imagen', 'precio']
                    })
                    .then(datos => {
                        res.render(path.resolve(__dirname, "..", "views", "products", "home_secundario"), { productos: datos, usuarioLog: req.session.userLogged })
                    })
                break;
        }

    },
    create: (req, res) => {

        let formas, colores, marcas

        db.forms.findAll()
            .then((datos) => {
                formas = datos
                db.brands.findAll()
                    .then((datos) => {
                        marcas = datos
                        db.colors.findAll()
                            .then((datos) => {
                                colores = datos
                                return res.render(path.resolve(__dirname, "..", "views", "products", "create"), { formas: formas, colores: colores, marcas: marcas, usuarioLog: req.session.userLogged })
                            }).catch(error => res.send(error))
                    }).catch(error => res.send(error))
            }).catch(error => res.send(error))
    },
    modify: (req, res) => {

        let formas, colores, marcas

        db.products.findOne({
                where: { idproducto: req.params.id },
                attributes: ['idproducto', 'nombre', 'precio', 'descripcion', 'imagen', 'stock']
            })
            .then((producto) => {
                db.forms.findAll()
                    .then((datos) => {
                        formas = datos
                        db.brands.findAll()
                            .then((datos) => {
                                marcas = datos
                                db.colors.findAll()
                                    .then((datos) => {
                                        colores = datos
                                        return res.render(path.resolve(__dirname, "..", "views", "products", "modify"), { producto: producto, formas: formas, colores: colores, marcas: marcas, usuarioLog: req.session.userLogged })
                                    }).catch(error => res.send(error))
                            }).catch(error => res.send(error))
                    }).catch(error => res.send(error))
            }).catch(error => res.send(error))
    },
    crearProducto: (req, res) => {

        let imagenAGuardar = "/img/x-producto.jpg"
        if (req.file != undefined) {
            imagenAGuardar = "/img/products/" + req.file.filename;
        }

        db.products.create({
            nombre: req.body.nombre,
            precio: req.body.precio,
            descripcion: req.body.descripcion,
            stock: req.body.stock,
            imagen: imagenAGuardar,
            forma: req.body.forma,
            color: req.body.color,
            marca: req.body.marca

        })

        res.redirect("/")

    },
    modificarProducto: (req, res) => {

        let imagenAGuardar

        if (req.file != undefined) {
            if (req.file.filename != "") {
                imagenAGuardar = "/img/products/" + req.file.filename;

                db.products.update({
                    nombre: req.body.nombre,
                    precio: req.body.precio,
                    descripcion: req.body.descripcion,
                    stock: req.body.stock,
                    imagen: imagenAGuardar,
                    forma: req.body.forma,
                    color: req.body.color,
                    marca: req.body.marca

                }, {
                    where: { idproducto: req.params.id }
                })
            }
        } else {
            db.products.update({
                nombre: req.body.nombre,
                precio: req.body.precio,
                descripcion: req.body.descripcion,
                stock: req.body.stock,
                forma: req.body.forma,
                color: req.body.color,
                marca: req.body.marca

            }, {
                where: { idproducto: req.params.id }
            })
        }



        res.redirect("/products/")
    },
    borrarProducto: (req, res) => {

        db.products.destroy({ where: { idproducto: req.params.id } })

        res.redirect('/products/');
    }

}

module.exports = controller;