const express = require("express");
const router = express.Router();
const productController = require('../controllers/productsController');
const esAdmin = require('../middlewares/esAdmin')
const sinLoguear = require('../middlewares/sinLoguear')
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../../public/img/products'))
    },
    filename: (req, file, cb) => {

        const nombreArchivo = "product-" + Date.now() + path.extname(file.originalname);

        cb(null, nombreArchivo);
    }
})

const upload = multer({ storage })

router.get("/", productController.home_secundario)

router.get('/lista/:categoria', productController.itemsCategoria)

router.get('/edit/:id', sinLoguear, esAdmin, productController.modify)

router.get("/detail/:id", productController.detalleProducto)

router.get("/:categoria/:id", productController.home_lista_categoria)

router.get('/cart', sinLoguear, productController.carrito)

router.get('/create', sinLoguear, esAdmin, productController.create)

router.put('/:id', upload.single('imagen'), productController.modificarProducto)

router.post('/create', upload.single('imagen'), productController.crearProducto)

router.delete('/:id', productController.borrarProducto)

module.exports = router;