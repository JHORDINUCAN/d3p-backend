import axios from "axios";

interface BanxicoResponse {
  bmx: {
    series: {
      datos: {
        dato: string;
      }[];
    }[];
  };
}

export const getTipoCambio = async (): Promise<number | null> => {
  try {
    const url =
      "https://www.banxico.org.mx/SieAPIRest/service/v1/series/SF43718/datos/oportuno";
    const { data } = await axios.get<BanxicoResponse>(url, {
      headers: {
        "Bmx-Token": process.env.BANXICO_API_TOKEN || "",
        Accept: "application/json",
      },
    });

    const dato = data.bmx.series[0].datos[0].dato;
    return parseFloat(dato);
  } catch (error) {
    console.error("Error obteniendo tipo de cambio:", error);
    return null;
  }
};
