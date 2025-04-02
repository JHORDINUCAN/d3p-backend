import { Router } from 'express';
import {
  getContactos,
  getContactoById,
  createContacto,
  updateContacto,
  deleteContacto
} from '../controllers/contactos.controller';

const router = Router();

router.get('/', getContactos);
router.get('/:id', getContactoById);
router.post('/', createContacto);
router.put('/:id', updateContacto);
router.delete('/:id', deleteContacto);

export default router;
