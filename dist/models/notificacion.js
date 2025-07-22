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
class NotificacionModel {
    static getAll() {
        return __awaiter(this, void 0, void 0, function* () {
            const [rows] = yield database_1.default.query('SELECT * FROM notificaciones ORDER BY fecha_envio DESC');
            return rows;
        });
    }
    static getById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const [rows] = yield database_1.default.query('SELECT * FROM notificaciones WHERE id_notificacion = ?', [id]);
            return rows[0] || null;
        });
    }
    static create(data) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            const [result] = yield database_1.default.query(`INSERT INTO notificaciones (id_usuario, titulo, mensaje, leida, fecha_lectura)
       VALUES (?, ?, ?, ?, ?)`, [data.id_usuario, data.titulo, data.mensaje, (_a = data.leida) !== null && _a !== void 0 ? _a : false, (_b = data.fecha_lectura) !== null && _b !== void 0 ? _b : null]);
            return { id: result.insertId };
        });
    }
    static update(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const fields = Object.entries(data).filter(([_, value]) => value !== undefined);
            if (fields.length === 0)
                return false;
            const queryFields = fields.map(([key]) => `${key} = ?`).join(', ');
            const values = fields.map(([_, value]) => value);
            const [result] = yield database_1.default.query(`UPDATE notificaciones SET ${queryFields} WHERE id_notificacion = ?`, [...values, id]);
            return result.affectedRows > 0;
        });
    }
    static delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const [result] = yield database_1.default.query('DELETE FROM notificaciones WHERE id_notificacion = ?', [id]);
            return result.affectedRows > 0;
        });
    }
}
exports.default = NotificacionModel;
