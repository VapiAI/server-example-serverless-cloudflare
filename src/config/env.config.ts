export const envConfig = {
  weather: {
    baseUrl:
      process.env.WEATHER_BASE_URL ?? `https://api.openweathermap.org/data/2.5`,
    apiKey: process.env.WEATHER_API_KEY ?? ``,
  },
  openai: {
    apiKey:
      process.env.OPENAI_API_KEY ??
      `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`,
  },
  vapi: {
    baseUrl: process.env.VAPI_BASE_URL ?? "https://api.vapi.ai",
    apiKey: process.env.VAPI_API_KEY ?? "",
  },
};
