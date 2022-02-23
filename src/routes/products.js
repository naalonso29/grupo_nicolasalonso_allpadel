const express = require("express");
const router = express.Router();
const productController = require('../controllers/productsController');

router.get("/detail", productController.detalleProducto)

router.get('/cart', productController.carrito)

router.get("/home_secundario", productController.homeXCategoria)

router.get('/create', productController.create)

router.get('/modify', productController.modify)

module.exports = router;