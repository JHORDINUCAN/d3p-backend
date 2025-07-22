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
exports.vaciarCarrito = exports.eliminarProducto = exports.cambiarCantidadProducto = exports.agregarProductoAlCarrito = exports.agregarProductoPorUsuario = exports.vaciarCarritoPorUsuario = exports.getCarritoCompleto = void 0;
const database_1 = __importDefault(require("../database"));
const carrito_1 = __importDefault(require("../models/carrito"));
// Obtener productos del carrito completo por ID de usuario
const getCarritoCompleto = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id_usuario } = req.params;
        const [rows] = yield database_1.default.query(`
      SELECT 
        c.id_carrito,
        p.id_producto,
        p.nombre,
        p.descripcion,
        p.precio,
        p.imagen_url,
        p.stock,
        cd.cantidad
      FROM carrito c
      JOIN carrito_detalles cd ON c.id_carrito = cd.id_carrito
      JOIN productos p ON p.id_producto = cd.id_producto
      WHERE c.id_usuario = ? AND c.estado = 'activo'
    `, [id_usuario]);
        if (!rows || rows.length === 0) {
            res.status(404).json({ success: false, message: "No se encontró un carrito activo para este usuario" });
            return;
        }
        res.json({
            success: true,
            data: {
                id_carrito: rows[0].id_carrito,
                productos: rows
            }
        });
    }
    catch (error) {
        console.error("Error al obtener productos del carrito:", error);
        res.status(500).json({ success: false, message: "Error interno del servidor" });
    }
});
exports.getCarritoCompleto = getCarritoCompleto;
// Vaciar el carrito y cambiar su estado a "finalizado"
const vaciarCarritoPorUsuario = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id_usuario } = req.params;
        if (!id_usuario) {
            res.status(400).json({ success: false, message: "El id_usuario es requerido" });
            return;
        }
        // Obtener el carrito activo del usuario
        const [carritoRows] = yield database_1.default.query(`
      SELECT id_carrito 
      FROM carrito 
      WHERE id_usuario = ? AND estado = 'activo'
    `, [id_usuario]);
        if (!carritoRows || carritoRows.length === 0) {
            res.status(404).json({ success: false, message: "No se encontró un carrito activo para este usuario" });
            return;
        }
        const id_carrito = carritoRows[0].id_carrito;
        // Vaciar los productos del carrito
        yield database_1.default.query(`
      DELETE FROM carrito_detalles
      WHERE id_carrito = ?
    `, [id_carrito]);
        // Cambiar el estado del carrito a "finalizado"
        yield database_1.default.query(`
      UPDATE carrito
      SET estado = 'finalizado'
      WHERE id_carrito = ?
    `, [id_carrito]);
        res.json({ success: true, message: "Carrito vaciado y marcado como finalizado" });
    }
    catch (error) {
        console.error("Error al vaciar el carrito por usuario:", error);
        res.status(500).json({ success: false, message: "Error interno del servidor" });
    }
});
exports.vaciarCarritoPorUsuario = vaciarCarritoPorUsuario;
const agregarProductoPorUsuario = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id_usuario } = req.params;
        const { id_producto, cantidad } = req.body;
        if (!id_producto || !cantidad) {
            res.status(400).json({ success: false, message: "Faltan campos necesarios" });
            return;
        }
        // Buscar el carrito activo del usuario
        let [carritoRows] = yield database_1.default.query(`
      SELECT id_carrito 
      FROM carrito 
      WHERE id_usuario = ? AND estado = 'activo'
    `, [id_usuario]);
        // Si no hay un carrito activo, crear uno nuevo
        if (!carritoRows || carritoRows.length === 0) {
            const [result] = yield database_1.default.query(`
        INSERT INTO carrito (id_usuario, estado) 
        VALUES (?, 'activo')
      `, [id_usuario]);
            carritoRows = [{ id_carrito: result.insertId }]; // Obtener el ID del nuevo carrito
        }
        const id_carrito = carritoRows[0].id_carrito;
        // Verificar si el producto ya existe en el carrito
        const [productoExistente] = yield database_1.default.query(`
      SELECT cantidad 
      FROM carrito_detalles 
      WHERE id_carrito = ? AND id_producto = ?
    `, [id_carrito, id_producto]);
        if (productoExistente.length > 0) {
            // Si el producto ya existe, actualizar la cantidad
            const nuevaCantidad = productoExistente[0].cantidad + cantidad;
            yield database_1.default.query(`
        UPDATE carrito_detalles 
        SET cantidad = ? 
        WHERE id_carrito = ? AND id_producto = ?
      `, [nuevaCantidad, id_carrito, id_producto]);
            res.json({ success: true, message: "Cantidad actualizada en el carrito" });
        }
        else {
            // Si el producto no existe, agregarlo al carrito
            yield database_1.default.query(`
        INSERT INTO carrito_detalles (id_carrito, id_producto, cantidad) 
        VALUES (?, ?, ?)
      `, [id_carrito, id_producto, cantidad]);
            res.json({ success: true, message: "Producto agregado al carrito" });
        }
    }
    catch (error) {
        console.error("Error al agregar producto al carrito por usuario:", error);
        res.status(500).json({ success: false, message: "Error interno del servidor" });
    }
});
exports.agregarProductoPorUsuario = agregarProductoPorUsuario;
// 🆕 NUEVO: Agregar producto al carrito
const agregarProductoAlCarrito = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id_carrito = parseInt(req.params.id_carrito);
        const { id_producto, cantidad } = req.body;
        if (!id_producto || !cantidad) {
            res.status(400).json({ success: false, message: "Faltan campos necesarios" });
            return;
        }
        yield carrito_1.default.agregarProducto({ id_carrito, id_producto, cantidad });
        res.json({ success: true, message: "Producto agregado al carrito" });
    }
    catch (error) {
        console.error("Error al agregar producto:", error);
        res.status(500).json({ success: false, message: "Error interno del servidor" });
    }
});
exports.agregarProductoAlCarrito = agregarProductoAlCarrito;
const cambiarCantidadProducto = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id_carrito, id_producto } = req.params;
        const { cantidad } = req.body;
        if (cantidad < 1) {
            res.status(400).json({ success: false, message: "Cantidad inválida" });
            return;
        }
        yield database_1.default.query(`
      UPDATE carrito_detalles 
      SET cantidad = ?
      WHERE id_carrito = ? AND id_producto = ?
    `, [cantidad, id_carrito, id_producto]);
        res.json({ success: true, message: "Cantidad actualizada" });
    }
    catch (error) {
        console.error("Error al actualizar cantidad:", error);
        res.status(500).json({ success: false, message: "Error interno del servidor" });
    }
});
exports.cambiarCantidadProducto = cambiarCantidadProducto;
const eliminarProducto = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id_carrito, id_producto } = req.params;
        yield database_1.default.query(`
      DELETE FROM carrito_detalles
      WHERE id_carrito = ? AND id_producto = ?
    `, [id_carrito, id_producto]);
        res.json({ success: true, message: "Producto eliminado del carrito" });
    }
    catch (error) {
        console.error("Error al eliminar producto:", error);
        res.status(500).json({ success: false, message: "Error interno del servidor" });
    }
});
exports.eliminarProducto = eliminarProducto;
const vaciarCarrito = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id_carrito } = req.params;
        yield database_1.default.query(`
      DELETE FROM carrito_detalles
      WHERE id_carrito = ?
    `, [id_carrito]);
        res.json({ success: true, message: "Carrito vaciado" });
    }
    catch (error) {
        console.error("Error al vaciar el carrito:", error);
        res.status(500).json({ success: false, message: "Error interno del servidor" });
    }
});
exports.vaciarCarrito = vaciarCarrito;
