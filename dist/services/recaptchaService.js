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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyRecaptcha = verifyRecaptcha;
const axios_1 = __importDefault(require("axios"));
const SECRET = process.env.RECAPTCHA_SECRET || "";
if (!SECRET)
    throw new Error("Falta RECAPTCHA_SECRET en el .env");
/**
 * Verifica el token de reCAPTCHA enviado por el cliente.
 * @returns true si el captcha es válido.
 */
function verifyRecaptcha(token) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const url = "https://www.google.com/recaptcha/api/siteverify";
            const params = new URLSearchParams();
            params.append("secret", SECRET);
            params.append("response", token);
            const { data } = yield axios_1.default.post(url, params);
            return data.success === true;
        }
        catch (err) {
            console.error("Error validando reCAPTCHA:", err);
            return false;
        }
    });
}
