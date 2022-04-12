const path = require('path');
const product = require('../models/product')
const fs = require('fs');
const db = require('../../database/models');
const { validationResult } = require('express-validator');
const sequelize = require('sequelize');

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
    },
    apiLista: (req, res) => {

        db.products.findAll(
            {attributes: ['idproducto', 'nombre', 'descripcion', "coloresIdcolor", "formasIdforma", "marcasIdmarca", "imagen"]}
            )
            .then( productos => {

                let catForma = []
                let red = 0, lag = 0, dia = 0

                for(let i=0; i<productos.length; i++){
                    let info = ({
                        id: productos[i].idproducto, 
                        name: productos[i].nombre, 
                        descripcion: productos[i].descripcion,
                        color: productos[i].coloresIdcolor,
                        forma: productos[i].formasIdforma,
                        marca: productos[i].marcasIdmarca,
                        detail: "http://localhost:3001/api/products/" + productos[i].idproducto
                    })

                    if(productos[i].formasIdforma == 1){
                        red++
                    } else {
                        if(productos[i].formasIdforma == 2){
                            lag++
                        }else{
                            dia++
                        }
                    }

                    productos[i] = info
                }
                
                
                catForma.push({"Redonda": red})
                catForma.push({"Lagrima": lag})
                catForma.push({"Diamante": dia})

                res.json({
                    count: productos.length,
                    countByCategory: catForma,
                    products: productos,
                    status: 200
                })


            }).catch(error => {res.send(error)})
    },
    apiDetalle: (req,res) => {
        db.products.findOne({
            where: { idproducto: req.params.id },
            attributes: ['idproducto', 'nombre', 'precio', 'descripcion', 'imagen', 'stock'],
            include: [{ association: "colores" }, { association: "marcas" }, { association: "formas" }]
        })
        .then(producto => {
            res.json({
                producto,
                status: 200
            })
        }).catch(error => res.send(error))
    },
    apiUltimoCreado: (req,res) =>{

        db.products.findOne({
            limit: 1,
            order: [['idproducto', 'DESC']],
            attributes: ['idproducto', 'nombre', 'precio', 'descripcion', 'imagen', 'stock']
        })
            .then(producto => {
                res.json({
                    producto,
                    status: 200
                })
            }).catch(error => res.send(error))
    },
    apiTotalPorCategoria: (req,res) =>{
        
        let marcas, colores, formas, usuarios, productos 
        
        db.brands.count()
            .then( data => {
                marcas = data
                db.colors.count()
                .then( data => {
                    colores = data
                    db.forms.count()
                        .then( data => {
                            formas = data
                            db.products.count()
                                .then( data => {
                                    productos = data
                                    db.users.count()
                                        .then( data => {
                                            usuarios = data

                                            res.json({
                                                cantidadMarcas: marcas,
                                                cantidadColores: colores,
                                                cantidadFormas: formas,
                                                cantidadProductos: productos,
                                                cantidadUsuarios: usuarios
                                            })

                                            
                                        }).catch(error => console.log(error))
                                }).catch(error => console.log(error))
                        }).catch(error => console.log(error))
                }).catch(error => console.log(error))
            }).catch(error => console.log(error))
    
    },
    apiTotalPorFiltro: (req,res) =>{
    
        let colores,marcas,formas

        let sql = "SELECT C.nombre, Cantidad FROM Colors C "+
        "LEFT JOIN (Select coloresIdcolor, Count(1) as Cantidad FROM Products P GROUP BY p.coloresIdcolor) AS Tempo " +
        "ON C.idcolor = Tempo.coloresIdcolor " +
        "GROUP BY C.nombre"

        let sql2 = "SELECT C.nombre, Cantidad FROM brands C "+
        "LEFT JOIN (Select marcasIdmarca, Count(1) as Cantidad FROM Products P GROUP BY p.marcasIdmarca) AS Tempo "+
        "ON C.idmarca = Tempo.marcasIdmarca "+
        "GROUP BY C.nombre"

        let sql3 ="SELECT C.nombre, Cantidad FROM forms C "+
        "LEFT JOIN (Select formasIdforma, Count(1) as Cantidad FROM Products P GROUP BY p.formasIdforma) AS Tempo "+
        "ON C.idforma = Tempo.formasIdforma "+
        "GROUP BY C.nombre"

        db.sequelize.query(sql, { type: db.sequelize.QueryTypes.SELECT })
        .then(datos => {
            colores = datos
            db.sequelize.query(sql2, { type: db.sequelize.QueryTypes.SELECT })
            .then(datos => {
                marcas = datos
                db.sequelize.query(sql3, { type: db.sequelize.QueryTypes.SELECT })
                .then(datos => {
                    formas = datos
                    res.json({
                        listaColores: colores,
                        listaMarcas: marcas,
                        listaFormas: formas
                    })
                }).catch(error => res.send(error))
            }).catch(error => res.send(error))
        }).catch(error => res.send(error))
        
    }
}

module.exports = controller;

