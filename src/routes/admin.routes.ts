import { Router } from "express";
import { loginAdmin } from "../controllers/admin.controller";

const router = Router();

router.post("/login", loginAdmin); // POST /api/admin/login

export default router;
