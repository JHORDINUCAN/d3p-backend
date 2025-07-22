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
exports.getWeatherByCity = void 0;
const axios_1 = __importDefault(require("axios"));
const API_KEY = process.env.OPENWEATHER_API_KEY; // o como lo llames
const getWeatherByCity = (city_1, countryCode_1, ...args_1) => __awaiter(void 0, [city_1, countryCode_1, ...args_1], void 0, function* (city, countryCode, lang = "es") {
    var _a, _b, _c, _d;
    const url = `https://api.openweathermap.org/data/2.5/weather`;
    const { data } = yield axios_1.default.get(url, {
        params: {
            q: `${city},${countryCode}`,
            appid: API_KEY,
            units: "metric",
            lang,
        },
        timeout: 10000
    });
    return {
        temp: data.main.temp,
        description: (_b = (_a = data.weather) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.description,
        icon: (_d = (_c = data.weather) === null || _c === void 0 ? void 0 : _c[0]) === null || _d === void 0 ? void 0 : _d.icon,
    };
});
exports.getWeatherByCity = getWeatherByCity;
