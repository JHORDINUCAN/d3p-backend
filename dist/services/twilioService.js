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
exports.sendWhatsAppMessage = void 0;
const twilio_1 = __importDefault(require("twilio"));
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const fromNumber = process.env.TWILIO_PHONE_NUMBER;
if (!accountSid || !authToken || !fromNumber) {
    throw new Error('Faltan variables de entorno de Twilio');
}
const client = (0, twilio_1.default)(accountSid, authToken);
const sendWhatsAppMessage = (to, body) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const message = yield client.messages.create({
            body,
            from: fromNumber,
            to: `whatsapp:${to}`,
        });
        console.log('Mensaje enviado: ', message.sid);
        return message.sid;
    }
    catch (error) {
        console.error('Error al enviar el mensaje: ', error);
        throw error; // <-- Lanza el error para que la ruta lo capture
    }
});
exports.sendWhatsAppMessage = sendWhatsAppMessage;
