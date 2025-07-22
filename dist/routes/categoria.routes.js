"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const categoria_controller_1 = require("../controllers/categoria.controller");
const router = (0, express_1.Router)();
// Ruta para obtener todas las categorías
router.get("/", categoria_controller_1.getCategorias);
// Ruta para obtener productos por categoría
router.get('/categoria/:id_categoria', categoria_controller_1.getProductosPorCategoria);
exports.default = router;
