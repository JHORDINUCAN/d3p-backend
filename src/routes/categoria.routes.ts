import { Router } from "express";
import { getCategorias, getProductosPorCategoria } from "../controllers/categoria.controller";

const router = Router();

// Ruta para obtener todas las categorías
router.get("/", getCategorias);

// Ruta para obtener productos por categoría
router.get('/categoria/:id_categoria', getProductosPorCategoria);

export default router;