import axios from "axios";

interface RecaptchaResponse {
  success: boolean;
  challenge_ts: string;
  hostname: string;
  score?: number;
  action?: string;
  "error-codes"?: string[];
}

const SECRET: string = process.env.RECAPTCHA_SECRET || "";

if (!SECRET) throw new Error("Falta RECAPTCHA_SECRET en el .env");

/**
 * Verifica el token de reCAPTCHA enviado por el cliente.
 * @returns true si el captcha es válido.
 */
export async function verifyRecaptcha(token: string): Promise<boolean> {
  try {
    const url = "https://www.google.com/recaptcha/api/siteverify";

    const params = new URLSearchParams();
    params.append("secret", SECRET);
    params.append("response", token);

    const { data } = await axios.post<RecaptchaResponse>(url, params);

    return data.success === true;
  } catch (err) {
    console.error("Error validando reCAPTCHA:", err);
    return false;
  }
}
