const express = require("express");
const path = require('path');
const router = express.Router();
const usersController = require('../controllers/usersController');
const multer = require('multer');
const { body } = require('express-validator');
const estaLogueado = require('../middlewares/estaLogueado')
const sinLoguear = require('../middlewares/sinLoguear')

let validacionesLogin = [
    body('email').notEmpty().withMessage('Debe ingresar un email'),
    body('email').isEmail().withMessage('Debe ingresar un email valido'),
    body('password').notEmpty().withMessage('Debe ingresar contraseña')
]

let validacionesRegister = [
    body('nombre').notEmpty().withMessage('Debe ingresar un nombre'),
    body('nombre').isLength({ min: 2 }).withMessage('El nombre debe tener al menos 2 caracteres'),
    body('apellido').notEmpty().withMessage('Debe ingresar un apellido'),
    body('apellido').isLength({ min: 2 }).withMessage('El apellido debe tener al menos 2 caracteres'),
    body('email').notEmpty().withMessage('Debe ingresar un email'),
    body('email').isEmail().withMessage('Debe ingresar un email valido'),
    body('password').notEmpty().withMessage('Debe ingresar un contraseña'),
    body('password').isLength({ min: 8 }).withMessage('La clave debe tener al menos 8 caracteres')
]

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../../public/img/profiles'))
    },
    filename: (req, file, cb) => {

        const nombreArchivo = "profile-" + Date.now() + path.extname(file.originalname);

        cb(null, nombreArchivo);

    }
})

const upload = multer({ storage })

router.get("/login", estaLogueado, usersController.login)

router.post("/login", validacionesLogin, usersController.validarLogin);

router.get("/register", estaLogueado, usersController.register)

router.post("/register", upload.single('imagen'), validacionesRegister, usersController.crearPerfil)

router.get('/profile', sinLoguear, usersController.profile)

router.get('/cierre', usersController.cerrarSesion)

router.put("/profile", upload.single('imagen'), usersController.actualizarPerfil);

module.exports = router;