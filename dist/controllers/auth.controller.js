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
exports.updatePassword = exports.login = exports.register = void 0;
const auth_1 = __importDefault(require("../models/auth"));
const database_1 = __importDefault(require("../database"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const recaptchaService_1 = require("../services/recaptchaService");
const JWT_SECRET = process.env.JWT_SECRET || 'secretoUltraSegurísimo';
const register = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { nombre, correo, contraseña, direccion, rol } = req.body;
        if (!nombre || !correo || !contraseña) {
            res.status(400).json({ success: false, message: 'Faltan campos obligatorios' });
            return;
        }
        const userExist = yield auth_1.default.findByCorreo(correo);
        if (userExist) {
            res.status(409).json({ success: false, message: 'El correo ya está registrado' });
            return;
        }
        const hashedPassword = yield bcryptjs_1.default.hash(contraseña, 10);
        const nuevoUsuario = {
            nombre,
            correo,
            contraseña: hashedPassword,
            direccion,
            rol
        };
        const result = yield auth_1.default.create(nuevoUsuario);
        res.status(201).json({ success: true, data: { id: result.id }, message: 'Usuario registrado' });
    }
    catch (err) {
        next(err);
    }
});
exports.register = register;
const login = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { correo, contraseña, captchaToken } = req.body;
        // 1.  verifica que venga el captcha
        if (!captchaToken) {
            res
                .status(400)
                .json({ success: false, message: "Falta captchaToken" });
            return;
        }
        // 2.  valida con Google
        const captchaOk = yield (0, recaptchaService_1.verifyRecaptcha)(captchaToken);
        if (!captchaOk) {
            res
                .status(403)
                .json({ success: false, message: "Captcha inválido" });
            return;
        }
        // 3.  lógica de autenticación normal
        const usuario = yield auth_1.default.findByCorreo(correo);
        if (!usuario) {
            res
                .status(404)
                .json({ success: false, message: "Usuario no encontrado" });
            return;
        }
        const isMatch = yield bcryptjs_1.default.compare(contraseña, usuario.contraseña);
        if (!isMatch) {
            res
                .status(401)
                .json({ success: false, message: "Contraseña incorrecta" });
            return;
        }
        const token = jsonwebtoken_1.default.sign({ id_usuario: usuario.id_usuario, rol: usuario.rol }, JWT_SECRET, { expiresIn: "2h" });
        res.status(200).json({
            success: true,
            message: "Login exitoso",
            token,
            usuario: {
                id_usuario: usuario.id_usuario,
                nombre: usuario.nombre,
                correo: usuario.correo,
                rol: usuario.rol,
            },
        });
    }
    catch (err) {
        next(err);
    }
});
exports.login = login;
const updatePassword = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { correo, nuevaContraseña } = req.body;
    if (!correo || !nuevaContraseña) {
        res.status(400).json({ success: false, message: 'Correo y nueva contraseña son obligatorios' });
        return;
    }
    try {
        // Verificar si el correo existe
        const [user] = yield database_1.default.query('SELECT * FROM usuarios WHERE correo = ?', [correo]);
        if (!user || user.length === 0) {
            res.status(404).json({ success: false, message: 'Correo no registrado' });
            return;
        }
        // Encriptar la nueva contraseña
        const hashedPassword = yield bcryptjs_1.default.hash(nuevaContraseña, 10);
        // Actualizar la contraseña en la base de datos
        const [result] = yield database_1.default.query('UPDATE usuarios SET contraseña = ? WHERE correo = ?', [hashedPassword, correo]);
        if (result.affectedRows === 0) {
            res.status(500).json({ success: false, message: 'Error al actualizar la contraseña' });
            return;
        }
        res.status(200).json({ success: true, message: 'Contraseña actualizada correctamente' });
    }
    catch (error) {
        next(error);
    }
});
exports.updatePassword = updatePassword;
