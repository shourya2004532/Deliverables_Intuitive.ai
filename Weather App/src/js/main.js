import { fetchCityMatch, fetchWeatherByCoords } from "./api.js";
import { setLoading, setResultVisible, getCityInput, renderWeather, bindForm, showError, bindUnitToggle } from "./ui.js";

async function handleSubmit(event) {
  event.preventDefault();
  const city = getCityInput();

  if (!city) {
    return;
  }

  setLoading(true);
  setResultVisible(true);
  showError(true);

  try {
    const match = await fetchCityMatch(city);
    const weatherData = await fetchWeatherByCoords(match.latitude, match.longitude);
    renderWeather({ match, weatherData});
    setResultVisible(false);
  } catch (error) {
    showError(false);
    console.error(error);
  } finally {
    setLoading(false);
  }
}

bindForm(handleSubmit);
bindUnitToggle();
