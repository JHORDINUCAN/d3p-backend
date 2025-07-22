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
const exchangeService_1 = require("../services/exchangeService");
const router = (0, express_1.Router)();
router.get("/tipo-cambio", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const cambio = yield (0, exchangeService_1.getTipoCambio)();
    if (cambio === null)
        return res.status(500).json({ error: "No se pudo obtener el tipo de cambio" });
    res.json({ cambio });
}));
exports.default = router;
