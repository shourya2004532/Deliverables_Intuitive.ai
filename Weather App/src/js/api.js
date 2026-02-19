const GEOCODE_URL = "https://geocoding-api.open-meteo.com/v1/search";
const WEATHER_URL = "https://api.open-meteo.com/v1/forecast";
export async function fetchWeatherByCoords(latitude, longitude) {
  const weatherUrl = new URL(WEATHER_URL);
  weatherUrl.searchParams.set("latitude", latitude);
  weatherUrl.searchParams.set("longitude", longitude);
  weatherUrl.searchParams.set("current", [
    "temperature_2m",
    "relative_humidity_2m",
    "apparent_temperature",
    "wind_speed_10m",
    "weather_code"
  ].join(","));
  weatherUrl.searchParams.set("temperature_unit", "celsius");
  weatherUrl.searchParams.set("wind_speed_unit", "ms");
  weatherUrl.searchParams.set("timezone", "auto");

  const weatherResponse = await fetch(weatherUrl);
  if (!weatherResponse.ok) {
    throw new Error(`Unable to fetch weather data (HTTP ${weatherResponse.status}).`);
  }

  return weatherResponse.json();
}

export async function fetchCityMatch(city) {
  const geoUrl = new URL(GEOCODE_URL);
  geoUrl.searchParams.set("name", city);
  geoUrl.searchParams.set("count", "1");
  geoUrl.searchParams.set("language", "en");
  geoUrl.searchParams.set("format", "json");

  const geoResponse = await fetch(geoUrl);
  if (!geoResponse.ok) {
    throw new Error(`Unable to search for that city (HTTP ${geoResponse.status}).`);
  }
// results is an array of matches which are objects , we just want the first one .
  const geoData = await geoResponse.json();
  if (!geoData.results || geoData.results.length === 0) {
    throw new Error("No matching city found. Try adding a country code.");
  }
// cityname,latitude,longitude,countrycode
  return geoData.results[0];
}
