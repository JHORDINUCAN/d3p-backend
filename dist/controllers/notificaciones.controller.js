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
exports.deleteNotificacion = exports.updateNotificacion = exports.createNotificacion = exports.getNotificacionById = exports.getNotificaciones = void 0;
const notificacion_1 = __importDefault(require("../models/notificacion"));
const getNotificaciones = (_, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield notificacion_1.default.getAll();
        res.status(200).json({ success: true, data });
    }
    catch (err) {
        next(err);
    }
});
exports.getNotificaciones = getNotificaciones;
const getNotificacionById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id))
            res.status(400).json({ success: false, message: 'ID inválido' });
        const noti = yield notificacion_1.default.getById(id);
        if (!noti)
            res.status(404).json({ success: false, message: 'No encontrada' });
        res.status(200).json({ success: true, data: noti });
    }
    catch (err) {
        next(err);
    }
});
exports.getNotificacionById = getNotificacionById;
const createNotificacion = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id_usuario, titulo, mensaje } = req.body;
        if (!id_usuario || !titulo || !mensaje) {
            res.status(400).json({ success: false, message: 'Faltan campos obligatorios' });
            return;
        }
        const result = yield notificacion_1.default.create({ id_usuario, titulo, mensaje });
        res.status(201).json({ success: true, data: { id: result.id } });
    }
    catch (err) {
        next(err);
    }
});
exports.createNotificacion = createNotificacion;
const updateNotificacion = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id))
            res.status(400).json({ success: false, message: 'ID inválido' });
        const success = yield notificacion_1.default.update(id, req.body);
        if (!success)
            res.status(404).json({ success: false, message: 'No actualizada' });
        res.status(200).json({ success: true, message: 'Actualizada correctamente' });
    }
    catch (err) {
        next(err);
    }
});
exports.updateNotificacion = updateNotificacion;
const deleteNotificacion = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id))
            res.status(400).json({ success: false, message: 'ID inválido' });
        const success = yield notificacion_1.default.delete(id);
        if (!success)
            res.status(404).json({ success: false, message: 'No eliminada' });
        res.status(200).json({ success: true, message: 'Eliminada correctamente' });
    }
    catch (err) {
        next(err);
    }
});
exports.deleteNotificacion = deleteNotificacion;
