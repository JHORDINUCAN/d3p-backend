"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const metodos_pago_controller_1 = require("../controllers/metodos_pago.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const wrapController = (fn) => {
    return (req, res, next) => fn(req, res, next).catch(next);
};
const router = (0, express_1.Router)();
router.post('/', auth_middleware_1.verificarToken, wrapController(metodos_pago_controller_1.crearMetodoPago));
router.get('/pedido/:id_pedido', auth_middleware_1.verificarToken, wrapController(metodos_pago_controller_1.getMetodoPorPedido));
router.put('/:id_pago', auth_middleware_1.verificarToken, auth_middleware_1.soloAdmin, wrapController(metodos_pago_controller_1.updateMetodoPago));
router.delete('/:id_pago', auth_middleware_1.verificarToken, auth_middleware_1.soloAdmin, wrapController(metodos_pago_controller_1.deleteMetodoPago));
exports.default = router;
