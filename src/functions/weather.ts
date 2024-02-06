import { Bindings } from "../types/hono.types";

interface getWeatherParams {
  city: string;
  env: Bindings;
}

export const getWeather = async ({
  city,
  env,
}: getWeatherParams): Promise<any> => {
  const fallbackResponse = {
    result:
      "Could you please tell me the name of your city again? I wasn't able to retrieve the weather data previously. I'll use this information to provide you with the latest weather updates",
  };
  if (!city) {
    return fallbackResponse;
  }
  const url = `${env.WEATHER_BASE_URL}/weather?q=${city}&appid=${env.WEATHER_API_KEY}&units=metric`;
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Weather data fetch failed");
    }
    const data: any = await response.json();
    const weather = data.weather[0];
    return { result: weather.description };
  } catch (error) {
    console.error("Error fetching weather data:", error);
    return fallbackResponse;
  }
};
