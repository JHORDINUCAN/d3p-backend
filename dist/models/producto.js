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
class ProductoModel {
    static getAll() {
        return __awaiter(this, arguments, void 0, function* ({ page = 1, limit = 10, categoria_id, destacado, search } = {}) {
            const offset = (page - 1) * limit;
            let query = `
      SELECT p.*, c.nombre as categoria_nombre 
      FROM productos p
      JOIN categorias c ON p.categoria_id = c.id
      WHERE 1=1
    `;
            const params = [];
            if (categoria_id) {
                query += ' AND p.categoria_id = ?';
                params.push(categoria_id);
            }
            if (destacado !== undefined) {
                query += ' AND p.destacado = ?';
                params.push(destacado);
            }
            if (search) {
                query += ' AND (p.nombre LIKE ? OR p.descripcion LIKE ?)';
                params.push(`%${search}%`, `%${search}%`);
            }
            query += ' LIMIT ? OFFSET ?';
            params.push(limit, offset);
            const [productos] = yield database_1.default.query(query, params);
            // Consulta para el total
            let countQuery = 'SELECT COUNT(*) as total FROM productos WHERE 1=1';
            const countParams = params.slice(0, -2); // Excluir LIMIT y OFFSET
            if (categoria_id) {
                countQuery += ' AND categoria_id = ?';
            }
            if (destacado !== undefined) {
                countQuery += ' AND destacado = ?';
            }
            if (search) {
                countQuery += ' AND (nombre LIKE ? OR descripcion LIKE ?)';
            }
            const [totalRows] = yield database_1.default.query(countQuery, countParams);
            const total = totalRows[0].total;
            return {
                productos: productos,
                total
            };
        });
    }
    /**
     * Obtener producto por ID con información de categoría
     */
    static getById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const [rows] = yield database_1.default.query(`SELECT p.*, c.nombre as categoria_nombre 
       FROM productos p
       JOIN categorias c ON p.categoria_id = c.id
       WHERE p.id_producto = ?`, [id]);
            return rows[0] || null;
        });
    }
    /**
     * Crear nuevo producto con validación de categoría
     */
    static create(producto) {
        return __awaiter(this, void 0, void 0, function* () {
            // Verificar que la categoría exista
            const [categoria] = yield database_1.default.query('SELECT id FROM categorias WHERE id = ?', [producto.categoria_id]);
            if (!categoria.length) {
                throw new Error('La categoría especificada no existe');
            }
            const [result] = yield database_1.default.query(`INSERT INTO productos 
       (nombre, descripcion, precio, stock, categoria_id, imagen_url, destacado)
       VALUES (?, ?, ?, ?, ?, ?, ?)`, [
                producto.nombre,
                producto.descripcion,
                producto.precio,
                producto.stock || 0,
                producto.categoria_id,
                producto.imagen_url || null,
                producto.destacado || false
            ]);
            return { id: result.insertId };
        });
    }
    /**
     * Actualizar producto
     */
    static update(id, producto) {
        return __awaiter(this, void 0, void 0, function* () {
            if (producto.categoria_id) {
                // Verificar que la nueva categoría exista
                const [categoria] = yield database_1.default.query('SELECT id FROM categorias WHERE id = ?', [producto.categoria_id]);
                if (!categoria.length) {
                    throw new Error('La categoría especificada no existe');
                }
            }
            const fieldsToUpdate = Object.entries(producto)
                .filter(([_, value]) => value !== undefined)
                .map(([key]) => `${key} = ?`)
                .join(', ');
            if (!fieldsToUpdate)
                return false;
            const values = Object.values(producto).filter(value => value !== undefined);
            const [result] = yield database_1.default.query(`UPDATE productos SET ${fieldsToUpdate} WHERE id_producto = ?`, [...values, id]);
            return result.affectedRows > 0;
        });
    }
    static toggleActivo(id, activo) {
        return __awaiter(this, void 0, void 0, function* () {
            const [result] = yield database_1.default.query('UPDATE productos SET activo = ? WHERE id_producto = ?', [activo, id]);
            return result.affectedRows > 0;
        });
    }
    /**
     * Eliminar producto
     */
    static delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const [result] = yield database_1.default.query('DELETE FROM productos WHERE id_producto = ?', [id]);
            return result.affectedRows > 0;
        });
    }
    /**
     * Obtener productos destacados
     */
    static getDestacados() {
        return __awaiter(this, arguments, void 0, function* (limit = 5) {
            const [rows] = yield database_1.default.query(`SELECT p.*, c.nombre as categoria_nombre 
       FROM productos p
       JOIN categorias c ON p.categoria_id = c.id
       WHERE p.destacado = true
       LIMIT ?`, [limit]);
            return rows;
        });
    }
}
exports.default = ProductoModel;
