const express = require("express");
const router = express.Router();
const productController = require('../controllers/productsController');
const esAdmin = require('../middlewares/esAdmin')
const sinLoguear = require('../middlewares/sinLoguear')
const multer = require('multer');
const path = require('path');
const { body } = require('express-validator');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../../public/img/products'))
    },
    filename: (req, file, cb) => {

        const nombreArchivo = "product-" + Date.now() + path.extname(file.originalname);

        cb(null, nombreArchivo);
    }
})

let validarProducto = [
    body('nombre').notEmpty().withMessage('Debe ingresar un nombre'),
    body('nombre').isLength({ min: 5 }).withMessage('El nombre debe tener al menos 5 caracteres'),
    body('descripcion').isLength({ min: 20 }).withMessage('La descripcion debe tener al menos 20 caracteres'),
    body('stock').notEmpty().withMessage('Debe ingresar stock'),
    body('stock').isInt().withMessage('Debe ingresar un dato valido en stock'),
    body('precio').notEmpty().withMessage('Debe ingresar precio'),
    body('precio').isInt().withMessage('Debe ingresar un dato valido en precio'),
]

const upload = multer({ storage })

router.get("/", productController.home_secundario)

router.get('/lista/:categoria', productController.itemsCategoria)

router.get('/edit/:id', sinLoguear, esAdmin, productController.modify)

router.get("/detail/:id", productController.detalleProducto)

router.get("/:categoria/:id", productController.home_lista_categoria)

router.get('/cart', sinLoguear, productController.carrito)

router.get('/create', sinLoguear, esAdmin, productController.create)

router.put('/:id', upload.single('imagen'), validarProducto, productController.modificarProducto)

router.post('/create', upload.single('imagen'), validarProducto, productController.crearProducto)

router.delete('/:id', productController.borrarProducto)

module.exports = router;