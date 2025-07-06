import { Router } from "express";
import { getTipoCambio } from "../services/exchangeService";

const router = Router();

router.get("/tipo-cambio", async (req, res) => {
  const cambio = await getTipoCambio();
  if (cambio === null) return res.status(500).json({ error: "No se pudo obtener el tipo de cambio" });
  res.json({ cambio });
});

export default router;
