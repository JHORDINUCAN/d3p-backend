import { Router } from 'express';
import { register, login } from '../controllers/auth.controller';
import { updatePassword } from '../controllers/auth.controller';
import { obtenerUsuarios } from "../controllers/auth.controller"; // Ajusta la ruta según tu estructura
import { verificarToken, soloAdmin } from "../middlewares/auth.middleware";
const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/update-password', updatePassword);
router.get("/usuarios", verificarToken, soloAdmin, obtenerUsuarios);



export default router;
