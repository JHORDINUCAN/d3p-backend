"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDetallesPedido = exports.getPedidosByUsuario = exports.crearPedido = void 0;
const pedido_1 = __importDefault(require("../models/pedido"));
const crearPedido = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id_usuario, id_carrito } = req.body;
        if (!id_usuario || !id_carrito) {
            res.status(400).json({ success: false, message: 'Faltan datos' });
            return;
        }
        const result = yield pedido_1.default.crearPedido(id_usuario, id_carrito);
        res.status(201).json({
            success: true,
            data: { id_pedido: result.id },
            message: 'Pedido creado exitosamente'
        });
    }
    catch (err) {
        next(err);
    }
});
exports.crearPedido = crearPedido;
const getPedidosByUsuario = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id_usuario = parseInt(req.params.id_usuario);
        if (isNaN(id_usuario)) {
            res.status(400).json({ success: false, message: 'ID de usuario inválido' });
            return;
        }
        const pedidos = yield pedido_1.default.getPedidosByUsuario(id_usuario);
        res.status(200).json({ success: true, data: pedidos });
    }
    catch (err) {
        next(err);
    }
});
exports.getPedidosByUsuario = getPedidosByUsuario;
const getDetallesPedido = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id_pedido = parseInt(req.params.id_pedido);
        if (isNaN(id_pedido)) {
            res.status(400).json({ success: false, message: 'ID de pedido inválido' });
            return;
        }
        const detalles = yield pedido_1.default.getDetallesPedido(id_pedido);
        res.status(200).json({ success: true, data: detalles });
    }
    catch (err) {
        next(err);
    }
});
exports.getDetallesPedido = getDetallesPedido;
