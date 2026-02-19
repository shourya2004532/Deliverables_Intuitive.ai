import {
  formatTemperature,
  formatWind,
  formatUpdatedTime,
  weatherCodeToDescription
} from "./utils.js";

const form = document.getElementById("weather-form");
const cityInput = document.getElementById("city-input");
const submitButton = form.querySelector(".primary-btn");
const resultEl = document.getElementById("result");

const locationEl = document.getElementById("location");
const descriptionEl = document.getElementById("description");
const temperatureEl = document.getElementById("temperature");
const feelsLikeEl = document.getElementById("feels-like");
const humidityEl = document.getElementById("humidity");
const windEl = document.getElementById("wind");
const updatedEl = document.getElementById("updated");
const errorEl = document.getElementById("error");
const unitButtons = document.querySelectorAll(".unit-toggle__btn");
let currentUnit = "c";
let lastPayload = null;

function updateUnitButtons() {
  unitButtons.forEach((button) => {
    const isActive = button.dataset.unit === currentUnit;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });
}

export function bindUnitToggle() {
  unitButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const nextUnit = button.dataset.unit;
      if (nextUnit === currentUnit) {
        return;
      }
      currentUnit = nextUnit;
      updateUnitButtons();
      if (lastPayload) {
        renderWeather(lastPayload);
      }
    });
  });
  updateUnitButtons();
}
export function setLoading(isLoading) 
{
  submitButton.disabled = isLoading;
  submitButton.textContent = isLoading ? "Loading..." : "Get Weather";
}

export function setResultVisible(show) 
{
  resultEl.hidden = show;
}

export function getCityInput() 
{
  return cityInput.value.trim();
}

export function showError(show1)
{
  errorEl.hidden = show1;
}

export function renderWeather({ match, weatherData }) 
{
  lastPayload = { match, weatherData };
  const current = weatherData.current;
  locationEl.textContent = `${match.name}, ${match.country_code.toUpperCase()}`;
  descriptionEl.textContent = weatherCodeToDescription(current.weather_code);
  temperatureEl.textContent = formatTemperature(current.temperature_2m, currentUnit);
  feelsLikeEl.textContent = formatTemperature(current.apparent_temperature, currentUnit);
  humidityEl.textContent = `${current.relative_humidity_2m}%`;
  windEl.textContent = formatWind(current.wind_speed_10m);
  updatedEl.textContent = formatUpdatedTime(current.time);
}

export function bindForm(handler) 
{
  form.addEventListener("submit", handler);
}
