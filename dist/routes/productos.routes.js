"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const productos_controller_1 = require("../controllers/productos.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
// Función para envolver controladores y forzar compatibilidad con RequestHandler
const wrapController = (controller) => {
    return (req, res, next) => {
        controller(req, res, next).catch(next);
    };
};
const router = (0, express_1.Router)();
// Ruta para obtener productos destacados
router.get("/destacados", productos_controller_1.getProductosDestacados);
router.get('/', wrapController(productos_controller_1.getProductos));
router.get('/:id', wrapController(productos_controller_1.getProductoById));
router.post('/', auth_middleware_1.verificarToken, auth_middleware_1.soloAdmin, wrapController(productos_controller_1.createProducto));
router.put('/:id', auth_middleware_1.verificarToken, auth_middleware_1.soloAdmin, wrapController(productos_controller_1.updateProducto));
router.delete('/:id', auth_middleware_1.verificarToken, auth_middleware_1.soloAdmin, wrapController(productos_controller_1.deleteProducto));
router.patch('/:id/estado', auth_middleware_1.verificarToken, auth_middleware_1.soloAdmin, wrapController(productos_controller_1.toggleEstadoProducto));
exports.default = router;
