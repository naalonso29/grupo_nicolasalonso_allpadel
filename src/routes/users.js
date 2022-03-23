const express = require("express");
const path = require('path');
const router = express.Router();
const usersController = require('../controllers/usersController');
const multer = require('multer');
const { body } = require('express-validator');
const estaLogueado = require('../middlewares/estaLogueado')
const sinLoguear = require('../middlewares/sinLoguear')

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

router.post("/login", usersController.validarLogin);

router.get("/register", estaLogueado, usersController.register)

router.post("/register", usersController.crearPerfil)

router.get('/profile', sinLoguear, usersController.profile)

router.get('/cierre', usersController.cerrarSesion)

router.put("/profile", upload.single('imagen'), usersController.actualizarPerfil);

module.exports = router;