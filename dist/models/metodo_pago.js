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
class MetodoPagoModel {
    static create(metodo) {
        return __awaiter(this, void 0, void 0, function* () {
            const [result] = yield database_1.default.query(`INSERT INTO metodos_de_pago (id_pedido, monto, metodo, estado, fecha_pago)
           VALUES (?, ?, ?, ?, NOW())`, [
                metodo.id_pedido,
                metodo.monto,
                metodo.metodo,
                metodo.estado || 'pendiente'
            ]);
            return { id: result.insertId };
        });
    }
    static getByPedido(id_pedido) {
        return __awaiter(this, void 0, void 0, function* () {
            const [rows] = yield database_1.default.query(`SELECT * FROM metodos_de_pago WHERE id_pedido = ? LIMIT 1`, [id_pedido]);
            return rows[0] || null;
        });
    }
    static update(id_pago, datos) {
        return __awaiter(this, void 0, void 0, function* () {
            const campos = Object.entries(datos)
                .filter(([_, v]) => v !== undefined)
                .map(([k]) => `${k} = ?`).join(', ');
            if (!campos)
                return false;
            const valores = Object.values(datos).filter(v => v !== undefined);
            const [result] = yield database_1.default.query(`UPDATE metodos_de_pago SET ${campos} WHERE id_pago = ?`, [...valores, id_pago]);
            return result.affectedRows > 0;
        });
    }
    static delete(id_pago) {
        return __awaiter(this, void 0, void 0, function* () {
            const [result] = yield database_1.default.query(`DELETE FROM metodos_de_pago WHERE id_pago = ?`, [id_pago]);
            return result.affectedRows > 0;
        });
    }
}
exports.default = MetodoPagoModel;
