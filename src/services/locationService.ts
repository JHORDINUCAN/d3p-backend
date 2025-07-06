import axios from "axios";

export interface Ubicacion {
  ciudad: string;
  region: string;
  pais: string;
  codigoPostal: string;
}

interface IPInfoResponse {
  city: string;
  region: string;
  country: string;
  postal: string;
}

export const getUbicacion = async (): Promise<Ubicacion | null> => {
  try {
    const token = process.env.IPINFO_TOKEN;
    if (!token) throw new Error("Falta IPINFO_TOKEN en variables de entorno");

    const url = `https://ipinfo.io/json?token=${token}`;
    const { data } = await axios.get<IPInfoResponse>(url); // 👈 Aquí está la magia

    return {
      ciudad: data.city,
      region: data.region,
      pais: data.country,
      codigoPostal: data.postal,
    };
  } catch (err) {
    console.error("Error geolocalización:", err);
    return null;
  }
};
