import { Router } from 'express';
import {
  getProductos,
  getProductoById,
  createProducto,
  updateProducto,
  deleteProducto,
  getProductosDestacados,
  toggleEstadoProducto
} from '../controllers/productos.controller';
import { verificarToken, soloAdmin } from '../middlewares/auth.middleware';
import { RequestHandler } from 'express';

// Función para envolver controladores y forzar compatibilidad con RequestHandler
const wrapController = (controller: (...args: any[]) => Promise<void>): RequestHandler => {
  return (req, res, next) => {
    controller(req, res, next).catch(next);
  };
};

const router = Router();
// Ruta para obtener productos destacados
router.get("/destacados", getProductosDestacados);

router.get('/', wrapController(getProductos));
router.get('/:id', wrapController(getProductoById));

router.post('/', verificarToken, soloAdmin, wrapController(createProducto));
router.put('/:id', verificarToken, soloAdmin, wrapController(updateProducto));
router.delete('/:id', verificarToken, soloAdmin, wrapController(deleteProducto));
router.patch('/:id/estado', verificarToken, soloAdmin, wrapController(toggleEstadoProducto));

export default router;