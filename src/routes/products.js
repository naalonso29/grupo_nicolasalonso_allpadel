const express = require("express");
const router = express.Router();
const productController = require('../controllers/productsController');

router.get("/detail", productController.detalleProducto)

module.exports = router;