"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.soloAdmin = exports.verificarToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const JWT_SECRET = process.env.JWT_SECRET || 'secretoUltraSegurísimo';
const verificarToken = (req, res, next) => {
    var _a;
    const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(' ')[1];
    if (!token) {
        res.status(401).json({ success: false, message: 'Token no proporcionado' });
        return;
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        req.usuario = decoded;
        next();
    }
    catch (error) {
        res.status(403).json({ success: false, message: 'Token inválido' });
    }
};
exports.verificarToken = verificarToken;
const soloAdmin = (req, res, next) => {
    var _a;
    if (((_a = req.usuario) === null || _a === void 0 ? void 0 : _a.rol) !== 'admin') {
        res.status(403).json({ success: false, message: 'Acceso restringido a administradores' });
        return;
    }
    next();
};
exports.soloAdmin = soloAdmin;
