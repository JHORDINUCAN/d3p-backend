import { Router } from "express";
import { getCategorias, getProductosPorCategoria, updateCategoria, crearCategoria  } from "../controllers/categoria.controller";
import { verificarToken, soloAdmin } from "../middlewares/auth.middleware";



const router = Router();

// Ruta para obtener todas las categorías
router.get("/", getCategorias);

// Ruta para obtener productos por categoría
router.get('/categoria/:id_categoria', getProductosPorCategoria);
router.post("/api/categorias", crearCategoria);

router.put("/:id", updateCategoria);


export default router;