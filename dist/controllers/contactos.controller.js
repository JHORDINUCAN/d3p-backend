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
exports.deleteContacto = exports.updateContacto = exports.createContacto = exports.getContactoById = exports.getContactos = void 0;
const contacto_1 = __importDefault(require("../models/contacto"));
const getContactos = (_, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield contacto_1.default.getAll();
        res.status(200).json({ success: true, data });
    }
    catch (err) {
        next(err);
    }
});
exports.getContactos = getContactos;
const getContactoById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id))
            res.status(400).json({ success: false, message: 'ID inválido' });
        const contacto = yield contacto_1.default.getById(id);
        if (!contacto)
            res.status(404).json({ success: false, message: 'No encontrado' });
        res.status(200).json({ success: true, data: contacto });
    }
    catch (err) {
        next(err);
    }
});
exports.getContactoById = getContactoById;
const createContacto = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { nombre_cliente, correo, mensaje, id_usuario } = req.body;
        if (!mensaje || (!nombre_cliente && !id_usuario)) {
            res.status(400).json({ success: false, message: 'Faltan datos para crear el mensaje' });
            return;
        }
        const result = yield contacto_1.default.create({
            nombre_cliente,
            correo,
            mensaje,
            id_usuario
        });
        res.status(201).json({ success: true, data: { id: result.id } });
    }
    catch (err) {
        next(err);
    }
});
exports.createContacto = createContacto;
const updateContacto = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id))
            res.status(400).json({ success: false, message: 'ID inválido' });
        const success = yield contacto_1.default.update(id, req.body);
        if (!success)
            res.status(404).json({ success: false, message: 'No actualizado' });
        res.status(200).json({ success: true, message: 'Contacto actualizado correctamente' });
    }
    catch (err) {
        next(err);
    }
});
exports.updateContacto = updateContacto;
const deleteContacto = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id))
            res.status(400).json({ success: false, message: 'ID inválido' });
        const success = yield contacto_1.default.delete(id);
        if (!success)
            res.status(404).json({ success: false, message: 'No eliminado' });
        res.status(200).json({ success: true, message: 'Contacto eliminado correctamente' });
    }
    catch (err) {
        next(err);
    }
});
exports.deleteContacto = deleteContacto;
