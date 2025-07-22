import { Router } from 'express';
import { register, login, updatePassword, obtenerUsuarios, toggleEstadoUsuario, cambiarRolUsuario } from '../controllers/auth.controller';
import { verificarToken, soloAdmin } from "../middlewares/auth.middleware";

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/update-password', updatePassword);
router.get("/usuarios", verificarToken, soloAdmin, obtenerUsuarios);
router.patch("/usuarios/:id/estado", verificarToken, soloAdmin, toggleEstadoUsuario);  
router.patch("/usuarios/:id/rol", verificarToken, soloAdmin, cambiarRolUsuario);



export default router;
