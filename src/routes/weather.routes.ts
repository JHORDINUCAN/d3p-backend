import { Router } from "express";
import { getWeatherByCity } from "../services/weatherService";
import { getUbicacion }   from "../services/locationService";

const router = Router();

/* GET /api/clima   (opcional ?ciudad=  &pais= ) */
router.get("/", async (req, res) => {
  try {
    // 1. intenta tomar query params
    let ciudad = req.query.ciudad as string | undefined;
    let pais   = (req.query.pais as string | undefined) || "MX";

    // 2. si no hay ciudad ⇒ usa servicio de ubicación
    if (!ciudad) {
      const ubi = await getUbicacion();
      if (!ubi) return res.status(500).send("No se pudo detectar ubicación");

      ciudad = ubi.ciudad;
      // usa el country code que devuelve ipinfo (ej. "MX")
      pais   = ubi.pais || pais;
    }

    const clima = await getWeatherByCity(ciudad!, pais);
    res.json({ ciudad, pais, clima });
  } catch (err: any) {
    console.error(err.response?.data || err);
    res.status(500).send("Error al obtener clima");
  }
});

export default router;
