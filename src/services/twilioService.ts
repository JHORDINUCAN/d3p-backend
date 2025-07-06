import Twilio from 'twilio';

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const fromNumber = process.env.TWILIO_PHONE_NUMBER;

if (!accountSid || !authToken || !fromNumber) {
  throw new Error('Faltan variables de entorno de Twilio');
}

const client = Twilio(accountSid, authToken);

export const sendWhatsAppMessage = async (to: string, body: string) => {
  try {
    const message = await client.messages.create({
      body,
      from: fromNumber,
      to: `whatsapp:${to}`,
    });
    console.log('Mensaje enviado: ', message.sid);
    return message.sid;
  } catch (error) {
    console.error('Error al enviar el mensaje: ', error);
    throw error; // <-- Lanza el error para que la ruta lo capture
  }
};