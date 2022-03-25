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
        res.render(path.resolve(__dirname, "..", "views", "users", "login"), { usuarioLog: req.session.userLogged })
    },
    register: (req, res) => {
        res.render(path.resolve(__dirname, "..", "views", "users", "register"), { usuarioLog: req.session.userLogged })
    },
    profile: (req, res) => {

        db.users.findOne({
                where: { id: req.session.userLogged.id },
                attributes: ['id', 'nombre', 'apellido', 'email', 'imagen', 'contrasenia'],
                include: [{ association: "tipos" }]
            })
            .then(datos => {
                res.render(path.resolve(__dirname, "..", "views", "users", "profile"), { usuario: datos, usuarioLog: req.session.userLogged })
            })


    },
    crearPerfil: (req, res) => {

        db.users.findOne({
                where: { email: req.body.email },
                attributes: ['id', 'nombre', 'apellido', 'email', 'imagen', 'contrasenia']
            })
            .then(datos => {

                if (datos == undefined) {

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
                        tiposIdtipo: 2

                    })

                    res.redirect('/users/login')

                } else {
                    res.send("ESTE MAIL YA EXISTE")
                }


            })

    },
    validarLogin: (req, res) => {

        db.users.findOne({
                where: { email: req.body.email },
                attributes: ['id', 'nombre', 'apellido', 'email', 'imagen', 'contrasenia', ["tiposIdtipo", "esAdmin"]]
            })
            .then(datos => {
                let usuario = datos

                let errors = validationResult(req)

                if (errors.isEmpty()) {

                    if (usuario.length != 0) {

                        if (bcrypt.compareSync(req.body.password, usuario.contrasenia)) {

                            req.session.userLogged = usuario;
                            res.redirect('/users/profile')

                        } else {
                            res.render(path.resolve(__dirname, "..", "views", "users", "login"), { errorclave: { clave: { msg: "Clave incorrecta" } }, usuarioLog: req.session.userLogged })
                        }

                    } else {
                        res.render(path.resolve(__dirname, "..", "views", "users", "login"), { erroremail: { email: { msg: "Email inexistente" } }, usuarioLog: req.session.userLogged })
                    }

                } else {
                    res.render(path.resolve(__dirname, "..", "views", "users", "login"), { errors: errors.array(), usuarioLog: req.session.userLogged })
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

    },
    cerrarSesion: (req, res) => {
        req.session.destroy()

        res.redirect("/")
    }
}

module.exports = controller;