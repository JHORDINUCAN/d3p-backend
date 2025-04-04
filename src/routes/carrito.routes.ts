import { Router } from 'express';
import {
  getCarritoCompleto,
  cambiarCantidadProducto,
  eliminarProducto,
  vaciarCarrito,
  agregarProductoAlCarrito // 🆕
} from '../controllers/carrito.controller';

import { verificarToken } from '../middlewares/auth.middleware';

const router = Router();

// Obtener productos del carrito
router.get('/usuario/:id_usuario/productos', verificarToken, getCarritoCompleto);

// Agregar producto al carrito 🆕
router.post('/:id_carrito/productos', verificarToken, agregarProductoAlCarrito);

// Cambiar cantidad
router.put('/:id_carrito/productos/:id_producto', verificarToken, cambiarCantidadProducto);

// Eliminar producto
router.delete('/:id_carrito/productos/:id_producto', verificarToken, eliminarProducto);

// Vaciar carrito
router.delete('/:id_carrito/vaciar', verificarToken, vaciarCarrito);

export default router;
