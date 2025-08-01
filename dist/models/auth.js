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
const database_1 = __importDefault(require("../database"));
class AuthModel {
    static findByCorreo(correo) {
        return __awaiter(this, void 0, void 0, function* () {
            const [rows] = yield database_1.default.query('SELECT * FROM usuarios WHERE correo = ?', [correo]);
            return rows[0] || null;
        });
    }
    static create(usuario) {
        return __awaiter(this, void 0, void 0, function* () {
            const [result] = yield database_1.default.query(`INSERT INTO usuarios (nombre, correo, contraseña, direccion, rol)
       VALUES (?, ?, ?, ?, ?)`, [
                usuario.nombre,
                usuario.correo,
                usuario.contraseña,
                usuario.direccion || null,
                usuario.rol || 'usuario'
            ]);
            return { id: result.insertId };
        });
    }
}
exports.default = AuthModel;
