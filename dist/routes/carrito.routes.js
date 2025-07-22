"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const carrito_controller_1 = require("../controllers/carrito.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = (0, express_1.Router)();
// Obtener productos del carrito
router.get('/usuario/:id_usuario/productos', auth_middleware_1.verificarToken, carrito_controller_1.getCarritoCompleto);
// Agregar producto al carrito por usuario
router.post('/:id_usuario/productos', auth_middleware_1.verificarToken, carrito_controller_1.agregarProductoPorUsuario);
// Agregar producto al carrito 
router.post('/:id_carrito/productos', auth_middleware_1.verificarToken, carrito_controller_1.agregarProductoAlCarrito);
// Cambiar cantidad
router.put('/:id_carrito/productos/:id_producto', auth_middleware_1.verificarToken, carrito_controller_1.cambiarCantidadProducto);
// Ruta para vaciar el carrito por ID de usuario
router.delete('/vaciar/:id_usuario', carrito_controller_1.vaciarCarritoPorUsuario);
// Eliminar producto
router.delete('/:id_carrito/productos/:id_producto', auth_middleware_1.verificarToken, carrito_controller_1.eliminarProducto);
// Vaciar carrito
router.delete('/:id_carrito/vaciar', auth_middleware_1.verificarToken, carrito_controller_1.vaciarCarrito);
exports.default = router;
