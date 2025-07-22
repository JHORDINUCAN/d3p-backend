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
exports.getProductosDestacados = exports.toggleEstadoProducto = exports.deleteProducto = exports.updateProducto = exports.createProducto = exports.getProductoById = exports.getProductos = void 0;
const producto_1 = __importDefault(require("../models/producto"));
const database_1 = __importDefault(require("../database"));
// Helper para validación de IDs
const validarIdProducto = (idParam) => {
    if (!idParam) {
        return { error: { status: 400, message: 'Se requiere el ID del producto' } };
    }
    const id = parseInt(idParam);
    if (isNaN(id) || id <= 0) {
        return { error: { status: 400, message: 'ID debe ser un número positivo' } };
    }
    return { id };
};
// Controlador completo con mejoras
const getProductos = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const page = Math.max(1, parseInt(req.query.page || '1'));
        const limit = Math.min(parseInt(req.query.limit || '10'), 100);
        const categoria_id = req.query.categoria_id ? parseInt(req.query.categoria_id) : undefined;
        const destacado = req.query.destacado ? req.query.destacado === 'true' : undefined;
        const search = req.query.search;
        const result = yield producto_1.default.getAll({
            page,
            limit,
            categoria_id,
            destacado,
            search
        });
        res.status(200).json({
            success: true,
            data: result.productos,
            pagination: {
                page,
                limit,
                total: result.total,
                totalPages: Math.ceil(result.total / limit),
                hasNextPage: page * limit < result.total
            }
        });
    }
    catch (error) {
        next(error);
    }
});
exports.getProductos = getProductos;
const getProductoById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id, error } = validarIdProducto(req.params.id);
        if (error) {
            res.status(error.status).json({ success: false, message: error.message });
            return;
        }
        if (!id) { // Esta validación es redundante pero TypeScript la pide
            res.status(400).json({ success: false, message: 'ID inválido' });
            return;
        }
        const producto = yield producto_1.default.getById(id);
        if (!producto) {
            res.status(404).json({ success: false, message: 'Producto no encontrado' });
            return;
        }
        res.status(200).json({ success: true, data: producto });
    }
    catch (error) {
        next(error);
    }
});
exports.getProductoById = getProductoById;
const createProducto = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const connection = yield database_1.default.getConnection();
    try {
        yield connection.beginTransaction();
        const { nombre, descripcion, precio, stock, categoria_id, imagen_url, destacado } = req.body;
        // Validación mejorada
        if (!(nombre === null || nombre === void 0 ? void 0 : nombre.trim())) {
            res.status(400).json({ success: false, message: 'Nombre es requerido' });
            return;
        }
        const precioNumber = Number(precio);
        if (isNaN(precioNumber)) {
            res.status(400).json({ success: false, message: 'Precio debe ser un número válido' });
            return;
        }
        if (precioNumber <= 0) {
            res.status(400).json({ success: false, message: 'Precio debe ser mayor a cero' });
            return;
        }
        if (!categoria_id) {
            res.status(400).json({ success: false, message: 'Categoría es requerida' });
            return;
        }
        const result = yield producto_1.default.create({
            nombre: nombre.trim(),
            descripcion: descripcion === null || descripcion === void 0 ? void 0 : descripcion.trim(),
            precio: precioNumber,
            stock: stock ? Number(stock) : 0,
            categoria_id: Number(categoria_id),
            imagen_url,
            destacado: destacado === true || destacado === 'true',
            activo: true // Asumimos que el producto es activo al crearlo
        });
        yield connection.commit();
        res.status(201).json({
            success: true,
            data: { id: result.id },
            message: 'Producto creado exitosamente'
        });
    }
    catch (error) {
        yield connection.rollback();
        next(error);
    }
    finally {
        connection.release();
    }
});
exports.createProducto = createProducto;
const updateProducto = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const connection = yield database_1.default.getConnection();
    try {
        yield connection.beginTransaction();
        const { id: productId, error } = validarIdProducto(req.params.id);
        if (error) {
            res.status(error.status).json({ success: false, message: error.message });
            return;
        }
        if (!productId) {
            res.status(400).json({ success: false, message: 'ID inválido' });
            return;
        }
        const productoExistente = yield producto_1.default.getById(productId);
        if (!productoExistente) {
            res.status(404).json({ success: false, message: 'Producto no encontrado' });
            return;
        }
        const { nombre, descripcion, precio, stock, categoria_id, imagen_url, destacado } = req.body;
        const updates = {};
        if (nombre !== undefined)
            updates.nombre = nombre.trim();
        if (descripcion !== undefined)
            updates.descripcion = descripcion === null || descripcion === void 0 ? void 0 : descripcion.trim();
        if (precio !== undefined) {
            const precioNumber = Number(precio);
            if (isNaN(precioNumber)) {
                res.status(400).json({ success: false, message: 'Precio debe ser un número válido' });
                return;
            }
            updates.precio = precioNumber;
        }
        if (stock !== undefined)
            updates.stock = Number(stock);
        if (categoria_id !== undefined)
            updates.categoria_id = Number(categoria_id);
        if (imagen_url !== undefined)
            updates.imagen_url = imagen_url;
        if (destacado !== undefined) {
            updates.destacado = destacado === true || destacado === 'true';
        }
        if (Object.keys(updates).length === 0) {
            res.status(400).json({ success: false, message: 'No se proporcionaron datos para actualizar' });
            return;
        }
        const success = yield producto_1.default.update(productId, updates);
        if (!success) {
            res.status(500).json({ success: false, message: 'Error al actualizar producto' });
            return;
        }
        yield connection.commit();
        res.status(200).json({ success: true, message: 'Producto actualizado exitosamente' });
    }
    catch (error) {
        yield connection.rollback();
        next(error);
    }
    finally {
        connection.release();
    }
});
exports.updateProducto = updateProducto;
const deleteProducto = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const connection = yield database_1.default.getConnection();
    try {
        yield connection.beginTransaction();
        const { id, error } = validarIdProducto(req.params.id);
        if (error) {
            res.status(error.status).json({ success: false, message: error.message });
            return;
        }
        if (!id) {
            res.status(400).json({ success: false, message: 'ID inválido' });
            return;
        }
        const productoExistente = yield producto_1.default.getById(id);
        if (!productoExistente) {
            res.status(404).json({ success: false, message: 'Producto no encontrado' });
            return;
        }
        const success = yield producto_1.default.delete(id);
        if (!success) {
            res.status(500).json({ success: false, message: 'Error al eliminar producto' });
            return;
        }
        yield connection.commit();
        res.status(200).json({ success: true, message: 'Producto eliminado exitosamente' });
    }
    catch (error) {
        yield connection.rollback();
        next(error);
    }
    finally {
        connection.release();
    }
});
exports.deleteProducto = deleteProducto;
const toggleEstadoProducto = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = parseInt(req.params.id);
        const { activo } = req.body;
        if (isNaN(id) || typeof activo !== "boolean") {
            res.status(400).json({ success: false, message: "Datos inválidos" });
            return;
        }
        const productoExistente = yield producto_1.default.getById(id);
        if (!productoExistente) {
            res.status(404).json({ success: false, message: 'Producto no encontrado' });
            return;
        }
        const result = yield producto_1.default.toggleActivo(id, activo);
        if (!result) {
            res.status(500).json({ success: false, message: 'No se pudo actualizar el estado' });
            return;
        }
        res.status(200).json({ success: true, message: `Producto ${activo ? 'activado' : 'desactivado'}` });
    }
    catch (error) {
        next(error);
    }
});
exports.toggleEstadoProducto = toggleEstadoProducto;
const getProductosDestacados = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Límite opcional para la cantidad de productos destacados
        const limit = Math.min(parseInt(req.query.limit || '5'), 20);
        // Consulta para obtener productos destacados
        const [productos] = yield database_1.default.query(`
      SELECT * 
      FROM productos 
      WHERE destacado = 1 
      LIMIT ?
    `, [limit]);
        res.status(200).json({ success: true, data: productos });
    }
    catch (error) {
        console.error("Error al obtener productos destacados:", error);
        next(error);
    }
});
exports.getProductosDestacados = getProductosDestacados;
