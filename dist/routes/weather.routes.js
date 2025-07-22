"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const weatherService_1 = require("../services/weatherService");
const locationService_1 = require("../services/locationService");
const router = (0, express_1.Router)();
/* GET /api/clima   (opcional ?ciudad=  &pais= ) */
router.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        // 1. intenta tomar query params
        let ciudad = req.query.ciudad;
        let pais = req.query.pais || "MX";
        // 2. si no hay ciudad ⇒ usa servicio de ubicación
        if (!ciudad) {
            const ubi = yield (0, locationService_1.getUbicacion)();
            if (!ubi)
                return res.status(500).send("No se pudo detectar ubicación");
            ciudad = ubi.ciudad;
            // usa el country code que devuelve ipinfo (ej. "MX")
            pais = ubi.pais || pais;
        }
        const clima = yield (0, weatherService_1.getWeatherByCity)(ciudad, pais);
        res.json({ ciudad, pais, clima });
    }
    catch (err) {
        console.error(((_a = err.response) === null || _a === void 0 ? void 0 : _a.data) || err);
        res.status(500).send("Error al obtener clima");
    }
}));
exports.default = router;
