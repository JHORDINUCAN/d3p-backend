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
exports.getTipoCambio = void 0;
const axios_1 = __importDefault(require("axios"));
const getTipoCambio = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const url = "https://www.banxico.org.mx/SieAPIRest/service/v1/series/SF43718/datos/oportuno";
        const { data } = yield axios_1.default.get(url, {
            headers: {
                "Bmx-Token": process.env.BANXICO_API_TOKEN || "",
                Accept: "application/json",
            },
        });
        const dato = data.bmx.series[0].datos[0].dato;
        return parseFloat(dato);
    }
    catch (error) {
        console.error("Error obteniendo tipo de cambio:", error);
        return null;
    }
});
exports.getTipoCambio = getTipoCambio;
