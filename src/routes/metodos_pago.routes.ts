import { Router } from 'express';
import {
  crearMetodoPago,
  getMetodoPorPedido,
  updateMetodoPago,
  deleteMetodoPago
} from '../controllers/metodos_pago.controller';

import { verificarToken, soloAdmin } from '../middlewares/auth.middleware';
import { RequestHandler } from 'express';

const wrapController = (fn: (...args: any[]) => Promise<void>): RequestHandler => {
  return (req, res, next) => fn(req, res, next).catch(next);
};

const router = Router();

router.post('/', verificarToken, wrapController(crearMetodoPago));
router.get('/pedido/:id_pedido', verificarToken, wrapController(getMetodoPorPedido));
router.put('/:id_pago', verificarToken, soloAdmin, wrapController(updateMetodoPago));
router.delete('/:id_pago', verificarToken, soloAdmin, wrapController(deleteMetodoPago));

export default router;
