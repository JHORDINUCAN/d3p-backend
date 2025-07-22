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
class PedidoModel {
    static crearPedido(id_usuario, carrito_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const connection = yield database_1.default.getConnection();
            try {
                yield connection.beginTransaction();
                // 1. Obtener productos del carrito
                const [productos] = yield connection.query(`SELECT cd.id_producto, cd.cantidad, p.precio
         FROM carrito_detalles cd
         JOIN productos p ON cd.id_producto = p.id_producto
         WHERE cd.id_carrito = ?`, [carrito_id]);
                if (!productos.length)
                    throw new Error('El carrito está vacío');
                // 2. Calcular total
                const total = productos.reduce((sum, p) => sum + p.cantidad * p.precio, 0);
                // 3. Insertar pedido
                const [pedidoResult] = yield connection.query(`INSERT INTO pedidos (id_usuario, estado, total)
         VALUES (?, 'pendiente', ?)`, [id_usuario, total]);
                const id_pedido = pedidoResult.insertId;
                // 4. Insertar detalles
                for (const producto of productos) {
                    yield connection.query(`INSERT INTO pedido_detalles (id_pedido, id_producto, cantidad, precio_unitario)
           VALUES (?, ?, ?, ?)`, [id_pedido, producto.id_producto, producto.cantidad, producto.precio]);
                }
                // 5. Limpiar carrito
                yield connection.query(`DELETE FROM carrito_detalles WHERE id_carrito = ?`, [carrito_id]);
                yield connection.query(`UPDATE carrito SET estado = 'finalizado' WHERE id_carrito = ?`, [carrito_id]);
                yield connection.commit();
                return { id: id_pedido };
            }
            catch (error) {
                yield connection.rollback();
                throw error;
            }
            finally {
                connection.release();
            }
        });
    }
    static getPedidosByUsuario(id_usuario) {
        return __awaiter(this, void 0, void 0, function* () {
            const [rows] = yield database_1.default.query(`SELECT * FROM pedidos WHERE id_usuario = ? ORDER BY fecha_pedido DESC`, [id_usuario]);
            return rows;
        });
    }
    static getDetallesPedido(id_pedido) {
        return __awaiter(this, void 0, void 0, function* () {
            const [rows] = yield database_1.default.query(`SELECT pd.*, p.nombre, p.imagen_url
       FROM pedido_detalles pd
       JOIN productos p ON pd.id_producto = p.id_producto
       WHERE pd.id_pedido = ?`, [id_pedido]);
            return rows;
        });
    }
}
exports.default = PedidoModel;
