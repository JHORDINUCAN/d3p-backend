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
class CarritoModel {
    static crearCarrito(id_usuario) {
        return __awaiter(this, void 0, void 0, function* () {
            const [result] = yield database_1.default.query(`INSERT INTO carrito (id_usuario, estado) VALUES (?, 'activo')`, [id_usuario]);
            return { id: result.insertId };
        });
    }
    static getCarritoUsuario(id_usuario) {
        return __awaiter(this, void 0, void 0, function* () {
            const [rows] = yield database_1.default.query(`SELECT * FROM carrito WHERE id_usuario = ? AND estado = 'activo' LIMIT 1`, [id_usuario]);
            return rows[0] || null;
        });
    }
    static agregarProducto(detalle) {
        return __awaiter(this, void 0, void 0, function* () {
            yield database_1.default.query(`INSERT INTO carrito_detalles (id_carrito, id_producto, cantidad)
       VALUES (?, ?, ?)
       ON DUPLICATE KEY UPDATE cantidad = cantidad + VALUES(cantidad)`, [detalle.id_carrito, detalle.id_producto, detalle.cantidad]);
        });
    }
    static getProductosCarrito(id_carrito) {
        return __awaiter(this, void 0, void 0, function* () {
            const [rows] = yield database_1.default.query(`SELECT cd.id_producto, cd.cantidad, p.nombre, p.precio, p.imagen_url,
              (cd.cantidad * p.precio) AS subtotal
       FROM carrito_detalles cd
       JOIN productos p ON cd.id_producto = p.id_producto
       WHERE cd.id_carrito = ?`, [id_carrito]);
            const productos = rows.map(p => (Object.assign(Object.assign({}, p), { precio: parseFloat(p.precio), subtotal: parseFloat(p.subtotal) })));
            const total = productos.reduce((sum, p) => sum + p.subtotal, 0);
            return { productos, total };
        });
    }
    static eliminarProducto(id_carrito, id_producto) {
        return __awaiter(this, void 0, void 0, function* () {
            const [result] = yield database_1.default.query(`DELETE FROM carrito_detalles WHERE id_carrito = ? AND id_producto = ?`, [id_carrito, id_producto]);
            return result.affectedRows > 0;
        });
    }
    static actualizarEstado(id_carrito, estado) {
        return __awaiter(this, void 0, void 0, function* () {
            const [result] = yield database_1.default.query(`UPDATE carrito SET estado = ? WHERE id_carrito = ?`, [estado, id_carrito]);
            return result.affectedRows > 0;
        });
    }
}
exports.default = CarritoModel;
