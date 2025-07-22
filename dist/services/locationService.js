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
exports.getUbicacion = void 0;
const axios_1 = __importDefault(require("axios"));
const getUbicacion = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const token = process.env.IPINFO_TOKEN;
        if (!token)
            throw new Error("Falta IPINFO_TOKEN en variables de entorno");
        const url = `https://ipinfo.io/json?token=${token}`;
        const { data } = yield axios_1.default.get(url); // 👈 Aquí está la magia
        return {
            ciudad: data.city,
            region: data.region,
            pais: data.country,
            codigoPostal: data.postal,
        };
    }
    catch (err) {
        console.error("Error geolocalización:", err);
        return null;
    }
});
exports.getUbicacion = getUbicacion;
