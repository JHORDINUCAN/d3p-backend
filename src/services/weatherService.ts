import axios from "axios";

const API_KEY = process.env.OPENWEATHER_API_KEY; // o como lo llames

interface WeatherAPIResponse {
  main: {
    temp: number;
  };
  weather: {
    description: string;
    icon: string;
  }[];
}

export const getWeatherByCity = async (
  city: string,
  countryCode: string,
  lang = "es"
) => {
  const url = `https://api.openweathermap.org/data/2.5/weather`;

  const { data } = await axios.get<WeatherAPIResponse>(url, {
    params: {
      q: `${city},${countryCode}`,
      appid: API_KEY,
      units: "metric",
      lang,
    },
  });

  return {
    temp: data.main.temp,
    description: data.weather?.[0]?.description,
    icon: data.weather?.[0]?.icon,
  };
};
