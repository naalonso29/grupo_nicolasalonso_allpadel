const express = require("express");
const path = require('path');
const router = express.Router();
const usersController = require('../controllers/usersController');
const productController = require('../controllers/productsController');

router.get("/users", usersController.apiListaUsuarios);

router.get("/users/:id", usersController.apiDetalleUsuario);

router.get("/products", productController.apiLista);

router.get("/products/ultimo", productController.apiUltimoCreado);

router.get("/products/totalcategorias", productController.apiTotalPorCategoria);

router.get("/products/totalfiltros", productController.apiTotalPorFiltro);

router.get("/products/:id", productController.apiDetalle);




module.exports = router;