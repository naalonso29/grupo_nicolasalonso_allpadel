const path = require('path');
const product = require('../models/product')
const fs = require('fs');
const db = require('../../database/models');
const { validationResult } = require('express-validator');

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

        let formas, colores, marcas

        let errors = validationResult(req)

        if (errors.isEmpty()) {

            if (req.file != undefined) {
                if (((path.extname(req.file.filename)).toLowerCase() == ".jpg") || ((path.extname(req.file.filename)).toLowerCase() == ".jpeg") || ((path.extname(req.file.filename)).toLowerCase() == ".png") || ((path.extname(req.file.filename)).toLowerCase() == ".gif")) {

                    imagenAGuardar = "/img/products/" + req.file.filename;

                    db.products.create({
                        nombre: req.body.nombre,
                        precio: req.body.precio,
                        descripcion: req.body.descripcion,
                        stock: req.body.stock,
                        imagen: imagenAGuardar,
                        formasIdforma: req.body.forma,
                        coloresIdcolor: req.body.color,
                        marcasIdmarca: req.body.marca

                    })

                    res.redirect("/")

                } else {
                    fs.unlinkSync(path.resolve("public", "img", "products", req.file.filename))
                    db.forms.findAll()
                        .then((datos) => {
                            formas = datos
                            db.brands.findAll()
                                .then((datos) => {
                                    marcas = datos
                                    db.colors.findAll()
                                        .then((datos) => {
                                            colores = datos
                                            res.render(path.resolve(__dirname, "..", "views", "products", "create"), { errorimagen: { imagen: { msg: "Formato de imagen invalido" } }, formas: formas, colores: colores, marcas: marcas, usuarioLog: req.session.userLogged })
                                        }).catch(error => res.send(error))
                                }).catch(error => res.send(error))
                        }).catch(error => res.send(error))
                }
                db.forms.findAll()
                    .then((datos) => {
                        formas = datos
                        db.brands.findAll()
                            .then((datos) => {
                                marcas = datos
                                db.colors.findAll()
                                    .then((datos) => {
                                        colores = datos
                                        res.render(path.resolve(__dirname, "..", "views", "products", "create"), { errorimagen: { imagen: { msg: "No se cargo imagen" } }, formas: formas, colores: colores, marcas: marcas, usuarioLog: req.session.userLogged })
                                    }).catch(error => res.send(error))
                            }).catch(error => res.send(error))
                    }).catch(error => res.send(error))
            }
        } else {
            db.forms.findAll()
                .then((datos) => {
                    formas = datos
                    db.brands.findAll()
                        .then((datos) => {
                            marcas = datos
                            db.colors.findAll()
                                .then((datos) => {
                                    colores = datos
                                    res.render(path.resolve(__dirname, "..", "views", "products", "create"), { errors: errors.array(), formas: formas, colores: colores, marcas: marcas, usuarioLog: req.session.userLogged })
                                }).catch(error => res.send(error))
                        }).catch(error => res.send(error))
                }).catch(error => res.send(error))
        }
    },
    modificarProducto: (req, res) => {

        let imagenAGuardar

        let formas, colores, marcas

        let errors = validationResult(req)

        if (errors.isEmpty()) {

            if (req.file != undefined) {
                if (((path.extname(req.file.filename)).toLowerCase() == ".jpg") || ((path.extname(req.file.filename)).toLowerCase() == ".jpeg") || ((path.extname(req.file.filename)).toLowerCase() == ".png") || ((path.extname(req.file.filename)).toLowerCase() == ".gif")) {
                    imagenAGuardar = "/img/products/" + req.file.filename;

                    db.products.update({
                        nombre: req.body.nombre,
                        precio: req.body.precio,
                        descripcion: req.body.descripcion,
                        stock: req.body.stock,
                        imagen: imagenAGuardar,
                        formasIdforma: req.body.forma,
                        coloresIdcolor: req.body.color,
                        marcasIdmarca: req.body.marca

                    }, {
                        where: { idproducto: req.params.id }
                    })

                    res.redirect("/products/")

                } else {
                    fs.unlinkSync(path.resolve("public", "img", "products", req.file.filename))
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
                                                    return res.render(path.resolve(__dirname, "..", "views", "products", "modify"), { errorimagen: { imagen: { msg: "Formato de imagen invalido" } }, producto: producto, formas: formas, colores: colores, marcas: marcas, usuarioLog: req.session.userLogged })
                                                }).catch(error => res.send(error))
                                        }).catch(error => res.send(error))
                                }).catch(error => res.send(error))
                        }).catch(error => res.send(error))
                }
            } else {
                db.products.update({
                    nombre: req.body.nombre,
                    precio: req.body.precio,
                    descripcion: req.body.descripcion,
                    stock: req.body.stock,
                    formasIdforma: req.body.forma,
                    coloresIdcolor: req.body.color,
                    marcasIdmarca: req.body.marca

                }, {
                    where: { idproducto: req.params.id }
                })

                res.redirect("/products/")
            }

        } else {
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
                                            return res.render(path.resolve(__dirname, "..", "views", "products", "modify"), { errors: errors.array(), producto: producto, formas: formas, colores: colores, marcas: marcas, usuarioLog: req.session.userLogged })
                                        }).catch(error => res.send(error))
                                }).catch(error => res.send(error))
                        }).catch(error => res.send(error))
                }).catch(error => res.send(error))
        }
    },
    borrarProducto: (req, res) => {

        db.products.destroy({ where: { idproducto: req.params.id } })

        res.redirect('/products/');
    }

}

module.exports = controller;