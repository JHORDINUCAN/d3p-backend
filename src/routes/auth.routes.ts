import { Router } from 'express';
import { register, login } from '../controllers/auth.controller';
import { updatePassword } from '../controllers/auth.controller';
const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/update-password', updatePassword);

export default router;
