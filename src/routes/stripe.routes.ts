import { Router, Request, Response } from 'express';
import Stripe from 'stripe';

const stripe = new Stripe('sk_test_51RBnSm0778qJCLUsmmZWLippF4nmKRGJRY86L9mY3Hy1XmyzgMVpajiOQ4OpAwzPmU9GKcNe5yNPM5JH4aY3fGF100rY0Pwg7l', { apiVersion: '2025-03-31.basil' });
const router = Router();

router.post('/crear-pago', async (req: Request, res: Response): Promise<void> => {
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

    const paymentIntent = await stripe.paymentIntents.create({
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
  } catch (error) {
    console.error(error);

    if (error instanceof Error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    } else {
      res.status(400).json({
        success: false,
        message: 'Ocurrió un error desconocido',
      });
    }
  }
});

export default router;