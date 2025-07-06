import { Router, Request, Response } from 'express';
import { getUbicacion } from '../services/locationService';

const router = Router();

router.get('/', async (_req: Request, res: Response) => {
  const ubicacion = await getUbicacion();
  if (ubicacion) {
    res.json({ success: true, ubicacion });
  } else {
    res.status(500).json({ success: false, message: 'No se pudo obtener la ubicación' });
  }
});

export default router;