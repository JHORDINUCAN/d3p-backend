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
exports.getProductosPorCategoria = exports.getCategorias = void 0;
const categoria_1 = __importDefault(require("../models/categoria"));
const database_1 = __importDefault(require("../database"));
// Obtener todas las categorías
const getCategorias = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const categorias = yield categoria_1.default.getCategorias();
        res.json({ success: true, data: categorias });
    }
    catch (error) {
        console.error("Error al obtener categorías:", error);
        res.status(500).json({ success: false, message: "Error interno del servidor" });
    }
});
exports.getCategorias = getCategorias;
// Obtener productos por categoría (con fix de campo)
const getProductosPorCategoria = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id_categoria } = req.params;
        const [rows] = yield database_1.default.query(`SELECT * FROM productos WHERE categoria_id = ?`, [id_categoria]);
        if (rows.length === 0) {
            res.status(404).json({ success: false, message: "No se encontraron productos para esta categoría" });
            return;
        }
        res.json({ success: true, data: rows });
    }
    catch (error) {
        console.error("Error al obtener productos por categoría:", error);
        res.status(500).json({ success: false, message: "Error interno del servidor" });
    }
});
exports.getProductosPorCategoria = getProductosPorCategoria;
