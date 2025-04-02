import { Router } from 'express';
import {
  crearPedido,
  getPedidosByUsuario,
  getDetallesPedido
} from '../controllers/pedidos.controller';
import { verificarToken } from '../middlewares/auth.middleware';

const router = Router();

router.post('/', verificarToken, crearPedido);
router.get('/usuario/:id_usuario', verificarToken, getPedidosByUsuario);
router.get('/:id_pedido', verificarToken, getDetallesPedido);

export default router;
