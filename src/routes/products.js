const express = require("express");
const router = express.Router();
const productController = require('../controllers/productsController');

router.get("/", productController.home_secundario)

router.get("/detail/:id", productController.detalleProducto)

router.get('/cart', productController.carrito)

router.get('/lista/:categoria', productController.homeXCategoria)

router.get('/create', productController.create)

router.get('/edit/:id', productController.modify)

router.put('/:id', productController.modificarProducto)

router.post('/create', productController.crearProducto)

router.delete('/:id', productController.borrarProducto)

module.exports = router;