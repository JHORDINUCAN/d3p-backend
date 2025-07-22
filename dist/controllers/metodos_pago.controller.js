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
exports.deleteMetodoPago = exports.updateMetodoPago = exports.getMetodoPorPedido = exports.crearMetodoPago = void 0;
const metodo_pago_1 = __importDefault(require("../models/metodo_pago"));
const crearMetodoPago = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id_pedido, monto, metodo, estado } = req.body;
        if (!id_pedido || !monto || !metodo) {
            res.status(400).json({ success: false, message: 'Faltan campos obligatorios' });
            return;
        }
        // 🔍 Validar si ya existe un método de pago para ese pedido
        const existente = yield metodo_pago_1.default.getByPedido(id_pedido);
        if (existente) {
            res.status(409).json({
                success: false,
                message: 'Ya existe un método de pago para este pedido. Puedes actualizarlo si es necesario.'
            });
            return;
        }
        const result = yield metodo_pago_1.default.create({ id_pedido, monto, metodo, estado });
        res.status(201).json({ success: true, data: { id_pago: result.id } });
    }
    catch (err) {
        next(err);
    }
});
exports.crearMetodoPago = crearMetodoPago;
const getMetodoPorPedido = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id_pedido = parseInt(req.params.id_pedido);
        const metodo = yield metodo_pago_1.default.getByPedido(id_pedido);
        if (!metodo) {
            res.status(404).json({ success: false, message: 'Método de pago no encontrado' });
            return;
        }
        res.status(200).json({ success: true, data: metodo });
    }
    catch (err) {
        next(err);
    }
});
exports.getMetodoPorPedido = getMetodoPorPedido;
const updateMetodoPago = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id_pago = parseInt(req.params.id_pago);
        const success = yield metodo_pago_1.default.update(id_pago, req.body);
        if (!success) {
            res.status(404).json({ success: false, message: 'No actualizado' });
            return;
        }
        res.status(200).json({ success: true, message: 'Método actualizado correctamente' });
    }
    catch (err) {
        next(err);
    }
});
exports.updateMetodoPago = updateMetodoPago;
const deleteMetodoPago = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id_pago = parseInt(req.params.id_pago);
        const success = yield metodo_pago_1.default.delete(id_pago);
        if (!success) {
            res.status(404).json({ success: false, message: 'No eliminado' });
            return;
        }
        res.status(200).json({ success: true, message: 'Método de pago eliminado' });
    }
    catch (err) {
        next(err);
    }
});
exports.deleteMetodoPago = deleteMetodoPago;
