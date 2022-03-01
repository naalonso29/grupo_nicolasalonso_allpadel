const path = require('path');
const user = require('../models/user')
const fs = require('fs');
const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');

const controller = {
    login: (req, res) => {
        res.render(path.resolve(__dirname, "..", "views", "users", "login"))
    },
    register: (req, res) => {
        res.render(path.resolve(__dirname, "..", "views", "users", "register"))
    },
    profile: (req, res) => {
        res.render(path.resolve(__dirname, "..", "views", "users", "profile"), { usuario: req.session.userLogged })
    },
    crearPerfil: (req, res) => {

        req.body.password = bcrypt.hashSync(req.body.password, 10);

        let email = req.body.email

        user.guardar(req.body);

        let nuevoUsuario = user.mostrarPorEmail(email)

        req.session.userLogged = nuevoUsuario;

        res.redirect('/users/profile')
    },
    validarLogin: (req, res) => {

        let usuario = user.mostrarPorEmail(req.body.email);

        let errors = validationResult(req)

        if (errors.isEmpty()) {

            if (usuario != undefined) {

                if (bcrypt.compareSync(req.body.password, usuario.password)) {

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
    },
    actualizarPerfil: (req, res) => {

        if (req.file == undefined) {

            req.file.filename = "/img/users/default-img.jpg"

        }

        user.editar(req, res);

        req.session.userLogged = user.mostrar(req.session.userLogged.id)

        res.render(path.resolve(__dirname, "..", "views", "users", "profile"), { usuario: req.session.userLogged });

    }
}

module.exports = controller;