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
const twilioService_1 = require("../services/twilioService");
const router = (0, express_1.Router)();
const sendMessageHandler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { phoneNumber, message } = req.body;
    if (!phoneNumber || !message) {
        return res.status(400).send('Faltan parámetros: phoneNumber y message.');
    }
    try {
        yield (0, twilioService_1.sendWhatsAppMessage)(phoneNumber, message);
        return res.status(200).send('Mensaje enviado correctamente');
    }
    catch (error) {
        return res.status(500).send('Error al enviar el mensaje');
    }
});
router.post('/send', sendMessageHandler);
exports.default = router;
