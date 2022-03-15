const path = require('path');
const user = require('../models/user')
const fs = require('fs');
const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');
const db = require('../../database/models');
const UserType = require('../../database/models/UserType');
const Sequelize = require('sequelize');

const controller = {
    login: (req, res) => {
        res.render(path.resolve(__dirname, "..", "views", "users", "login"))
    },
    register: (req, res) => {
        res.render(path.resolve(__dirname, "..", "views", "users", "register"))
    },
    profile: (req, res) => {
        db.sequelize.query("SELECT `users`.`id`, `users`.`nombre`, `users`.`apellido`, `users`.`imagen`, `users`.`email`, " +
                " `users`.`contrasenia`, `usertypes`.`nombre` as `esAdmin` FROM `users` INNER JOIN `usertypes` ON " +
                " `users`.`id_tipo` = `usertypes`.`id_tipo` WHERE `users`.`id` = :idUsuario", { replacements: { idUsuario: req.session.userLogged.id }, type: db.sequelize.QueryTypes.SELECT })
            .then(datos => {
                res.render(path.resolve(__dirname, "..", "views", "users", "profile"), { usuario: datos[0] })
            })


    },
    crearPerfil: (req, res) => {

        let sql = "SELECT `users`.`id`, `users`.`nombre`, `users`.`apellido`, `users`.`imagen`, `users`.`email`, " +
            " `users`.`contrasenia`, `usertypes`.`nombre` as `esAdmin` FROM `users` INNER JOIN `usertypes` ON " +
            " `users`.`id_tipo` = `usertypes`.`id_tipo` WHERE `users`.`email` = :emailusuario"

        db.sequelize.query(sql, { replacements: { emailusuario: req.body.email }, type: db.sequelize.QueryTypes.SELECT })
            .then(datos => {

                if (datos.length == 0) {

                    req.body.password = bcrypt.hashSync(req.body.password, 10);

                    let imagenAGuardar = "/img/profiles/default.jpg"
                    if (req.file != undefined) {
                        imagenAGuardar = "/img/profiles/" + req.file.filename;
                    }

                    db.users.create({

                        nombre: req.body.nombre,
                        apellido: req.body.apellido,
                        email: req.body.email,
                        contrasenia: req.body.password,
                        imagen: imagenAGuardar,
                        id_tipo: 2

                    })

                    res.redirect('/users/login')

                } else {
                    res.send("ESTE MAIL YA EXISTE")
                }


            })

    },
    validarLogin: (req, res) => {

        db.sequelize.query("SELECT `users`.`id`, `users`.`nombre`, `users`.`apellido`, `users`.`imagen`, `users`.`email`, " +
                " `users`.`contrasenia`, `usertypes`.`nombre` as `esAdmin` FROM `users` INNER JOIN `usertypes` ON " +
                " `users`.`id_tipo` = `usertypes`.`id_tipo` WHERE `users`.`email` = :emailusuario", { replacements: { emailusuario: req.body.email }, type: db.sequelize.QueryTypes.SELECT })
            .then(datos => {
                let usuario = datos[0]

                let errors = validationResult(req)

                if (errors.isEmpty()) {

                    if (usuario.length != 0) {

                        if (bcrypt.compareSync(req.body.password, usuario.contrasenia)) {

                            req.session.userLogged = usuario;
                            res.redirect('/users/profile')

                        } else {
                            res.render(path.resolve(__dirname, "..", "views", "users", "login"), { errorclave: { clave: { msg: "Clave incorrecta" } } })
                        }

                    } else {
                        res.render(path.resolve(__dirname, "..", "views", "users", "login"), { erroremail: { email: { msg: "Email inexistente" } } })
                    }

                } else {
                    res.render(path.resolve(__dirname, "..", "views", "users", "login"), { errors: errors.array() })
                }

            })


    },
    actualizarPerfil: (req, res) => {

        if (req.file != undefined) {

            db.users.update({
                imagen: '/img/profiles/' + req.file.filename

            }, {
                where: { id: req.session.userLogged.id }
            })
        }

        res.redirect("/users/profile")

    }
}

module.exports = controller;