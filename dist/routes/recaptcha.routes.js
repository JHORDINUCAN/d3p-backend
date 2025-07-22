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
const recaptchaService_1 = require("../services/recaptchaService");
const router = (0, express_1.Router)();
router.post("/verify-captcha", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { captchaToken } = req.body;
    if (!captchaToken)
        return res.status(400).json({ error: "Falta captchaToken" });
    const ok = yield (0, recaptchaService_1.verifyRecaptcha)(captchaToken);
    return ok
        ? res.status(200).json({ success: true })
        : res.status(403).json({ error: "Captcha inválido" });
}));
exports.default = router;
