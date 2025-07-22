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
const express_1 = require("express");
const stripe_1 = __importDefault(require("stripe"));
if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error("La clave secreta de Stripe no está configurada en las variables de entorno.");
}
const stripe = new stripe_1.default(process.env.STRIPE_SECRET_KEY, { apiVersion: '2025-06-30.basil' });
const router = (0, express_1.Router)();
router.post('/crear-pago', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { amount, currency, paymentMethodId } = req.body;
        if (!paymentMethodId) {
            res.status(400).json({
                success: false,
                message: 'El paymentMethodId es requerido.',
            });
            return;
        }
        const amountInCents = Math.round(amount * 100);
        const paymentIntent = yield stripe.paymentIntents.create({
            amount: amountInCents,
            currency: currency,
            payment_method: paymentMethodId,
            confirm: true,
            automatic_payment_methods: {
                enabled: true,
                allow_redirects: 'never',
            },
        });
        res.json({
            success: true,
            message: 'Pago procesado correctamente',
            paymentIntent: paymentIntent,
        });
    }
    catch (error) {
        console.error(error);
        if (error instanceof Error) {
            res.status(400).json({
                success: false,
                message: error.message,
            });
        }
        else {
            res.status(400).json({
                success: false,
                message: 'Ocurrió un error desconocido',
            });
        }
    }
}));
exports.default = router;
