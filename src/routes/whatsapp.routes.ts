import { Router, Request, Response } from 'express';
import { sendWhatsAppMessage } from '../services/twilioService';

const router = Router();

const sendMessageHandler = async (req: Request, res: Response) => {
  const { phoneNumber, message } = req.body;

  if (!phoneNumber || !message) {
    return res.status(400).send('Faltan parámetros: phoneNumber y message.');
  }

  try {
    await sendWhatsAppMessage(phoneNumber, message);
    return res.status(200).send('Mensaje enviado correctamente');
  } catch (error) {
    return res.status(500).send('Error al enviar el mensaje');
  }
};

router.post('/send', sendMessageHandler);

export default router;