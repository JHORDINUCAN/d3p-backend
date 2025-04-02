import { Router } from 'express';
import {
  getNotificaciones,
  getNotificacionById,
  createNotificacion,
  updateNotificacion,
  deleteNotificacion
} from '../controllers/notificaciones.controller';
import { verificarToken, soloAdmin } from '../middlewares/auth.middleware';

const router = Router();

router.get('/', verificarToken, getNotificaciones);
router.get('/:id', verificarToken, getNotificacionById);

router.post('/', verificarToken, soloAdmin, createNotificacion);
router.put('/:id', verificarToken, soloAdmin, updateNotificacion);
router.delete('/:id', verificarToken, soloAdmin, deleteNotificacion);

export default router;
