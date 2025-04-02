import { Router } from 'express';
import {
  crearCarrito,
  getCarritoUsuario,
  agregarProducto,
  getProductosCarrito,
  eliminarProducto,
  actualizarEstadoCarrito
} from '../controllers/carrito.controller';
import { verificarToken } from '../middlewares/auth.middleware';

const router = Router();

router.post('/', verificarToken, crearCarrito);
router.get('/:id_usuario', verificarToken, getCarritoUsuario);
router.post('/:id_carrito/productos', verificarToken, agregarProducto);
router.get('/:id_carrito/productos', verificarToken, getProductosCarrito);
router.delete('/:id_carrito/productos/:id_producto', verificarToken, eliminarProducto);
router.put('/:id_carrito', verificarToken, actualizarEstadoCarrito);

export default router;
