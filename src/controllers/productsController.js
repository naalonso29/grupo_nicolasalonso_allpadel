const path = require('path');
const product = require('../models/product')
const fs = require('fs');
const db = require('../../database/models');

const controller = {
    detalleProducto: (req, res) => {

        let sql = "SELECT p.id_producto, p.nombre, p.precio, p.descripcion, p.imagen, p.stock, c.nombre as color, f.nombre as forma, b.nombre as marca " +
            "from products as p INNER JOIN colors as c ON c.id_color = p.id_color " +
            "INNER JOIN forms as f on f.id_forma = p.id_forma " +
            "INNER JOIN brands as b on b.id_marca = p.id_marca WHERE p.id_producto = :idProducto"

        db.sequelize.query(sql, { replacements: { idProducto: req.params.id }, type: db.sequelize.QueryTypes.SELECT })
            .then(datos => {
                res.render(path.resolve(__dirname, "..", "views", "products", "detail"), { producto: datos[0] })
            })


    },
    carrito: (req, res) => {
        res.render(path.resolve(__dirname, "..", "views", "products", "cart"))
    },
    itemsCategoria: (req, res) => {
        let sql = ""

        switch (req.params.categoria) {
            case 'marcas':
                sql = "SELECT id_marca as id, nombre, imagen, 'marcas' as nombrecategoria FROM brands";
                break;
            case 'colores':
                sql = "SELECT id_color as id, nombre, imagen, 'colores' as nombrecategoria FROM colors";
                break;
            case 'formas':
                sql = "SELECT id_forma as id, nombre, imagen, 'formas' as nombrecategoria FROM forms";
                break;
        }

        if (sql != "") {
            db.sequelize.query(sql, { type: db.sequelize.QueryTypes.SELECT })
                .then(datos => {
                    res.render(path.resolve(__dirname, "..", "views", "products", "home_categorias"), { categoria: datos })
                })
        } else {
            res.send("NO EXISTE ESA CATEGORIA")
        }

    },
    home_secundario: (req, res) => {
        let sql = "SELECT * FROM products"

        db.sequelize.query(sql, { type: db.sequelize.QueryTypes.SELECT })
            .then(datos => {
                res.render(path.resolve(__dirname, "..", "views", "products", "home_secundario"), { productos: datos })
            })
    },
    home_lista_categoria: (req, res) => {
        let sql = ""

        switch (req.params.categoria) {
            case 'marcas':
                sql = "SELECT p.id_producto, p.nombre, p.precio, p.imagen FROM products as p WHERE id_marca = :idCategoria";
                break;
            case 'colores':
                sql = "SELECT p.id_producto, p.nombre, p.precio, p.imagen FROM products as p WHERE id_color = :idCategoria";
                break;
            case 'formas':
                sql = "SELECT p.id_producto, p.nombre, p.precio, p.imagen FROM products as p WHERE id_forma = :idCategoria";
                break;
        }

        if (sql != "") {
            db.sequelize.query(sql, { replacements: { idCategoria: req.params.id }, type: db.sequelize.QueryTypes.SELECT })
                .then(datos => {
                    res.render(path.resolve(__dirname, "..", "views", "products", "home_secundario"), { productos: datos })
                })
        } else {
            res.send("NO HAY PRODUCTOS DE ESTA CATEGORIA")
        }
    },
    create: (req, res) => {
        let sql2 = "SELECT * FROM forms"

        let sql3 = "SELECT * FROM brands"

        let sql4 = "SELECT * FROM colors"

        let formas, colores, marcas

        db.sequelize.query(sql2, { type: db.sequelize.QueryTypes.SELECT })
            .then((datos) => {
                formas = datos
                db.sequelize.query(sql3, { type: db.sequelize.QueryTypes.SELECT })
                    .then((datos) => {
                        marcas = datos
                        db.sequelize.query(sql4, { type: db.sequelize.QueryTypes.SELECT })
                            .then((datos) => {
                                colores = datos
                                return res.render(path.resolve(__dirname, "..", "views", "products", "create"), { formas: formas, colores: colores, marcas: marcas })
                            }).catch(error => res.send(error))
                    }).catch(error => res.send(error))
            }).catch(error => res.send(error))
    },
    modify: (req, res) => {

        let sql = "SELECT * FROM products WHERE id_producto = :idProducto"

        let sql2 = "SELECT * FROM forms"

        let sql3 = "SELECT * FROM brands"

        let sql4 = "SELECT * FROM colors"

        let formas, colores, marcas

        db.sequelize.query(sql, { replacements: { idProducto: req.params.id }, type: db.sequelize.QueryTypes.SELECT })
            .then((producto) => {
                db.sequelize.query(sql2, { type: db.sequelize.QueryTypes.SELECT })
                    .then((datos) => {
                        formas = datos
                        db.sequelize.query(sql3, { type: db.sequelize.QueryTypes.SELECT })
                            .then((datos) => {
                                marcas = datos
                                db.sequelize.query(sql4, { type: db.sequelize.QueryTypes.SELECT })
                                    .then((datos) => {
                                        colores = datos
                                        return res.render(path.resolve(__dirname, "..", "views", "products", "modify"), { producto: producto[0], formas: formas, colores: colores, marcas: marcas })
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
            id_forma: req.body.forma,
            id_color: req.body.color,
            id_marca: req.body.marca

        })

        res.redirect("/")

    },
    modificarProducto: (req, res) => {

        let imagenAGuardar

        if (req.file != undefined) {
            if (req.file.filename != "") {
                imagenAGuardar = "/img/products/" + req.file.filename;
            }
        } else {
            imagenAGuardar = "/img/x-producto.jpg"
        }

        db.products.update({
            nombre: req.body.nombre,
            precio: req.body.precio,
            descripcion: req.body.descripcion,
            stock: req.body.stock,
            imagen: imagenAGuardar,
            id_forma: req.body.forma,
            id_color: req.body.color,
            id_marca: req.body.marca

        }, {
            where: { id_producto: req.params.id }
        })

        res.redirect("/products/")
    },
    borrarProducto: (req, res) => {

        db.products.destroy({ where: { id_producto: req.params.id } })

        res.redirect('/products/');
    }

}

module.exports = controller;