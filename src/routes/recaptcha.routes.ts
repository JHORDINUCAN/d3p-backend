import { Router } from "express";
import { verifyRecaptcha } from "../services/recaptchaService";

const router = Router();

router.post("/verify-captcha", async (req, res) => {
  const { captchaToken } = req.body;
  if (!captchaToken) return res.status(400).json({ error: "Falta captchaToken" });

  const ok = await verifyRecaptcha(captchaToken);
  return ok
    ? res.status(200).json({ success: true })
    : res.status(403).json({ error: "Captcha inválido" });
});

export default router;
