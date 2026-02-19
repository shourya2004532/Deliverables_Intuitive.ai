export function formatTemperature(tempC, unit) {
  const temp = unit === "f" ? (tempC * 9) / 5 + 32 : tempC;
  const suffix = unit === "f" ? "F" : "C";
  return `${Math.round(temp)}\u00B0${suffix}`;
}

export function formatWind(speed) {
  return `${Math.round(speed)} m/s`;
}

export function formatUpdatedTime(isoString) {
  const date = new Date(isoString);
  return `Updated ${date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;
}

export function weatherCodeToDescription(code) {
  const map = {
    0: "Clear sky",
    1: "Mainly clear",
    2: "Partly cloudy",
    3: "Overcast",
    45: "Fog",
    48: "Depositing rime fog",
    51: "Light drizzle",
    53: "Moderate drizzle",
    55: "Dense drizzle",
    61: "Slight rain",
    63: "Moderate rain",
    65: "Heavy rain",
    71: "Slight snow",
    73: "Moderate snow",
    75: "Heavy snow",
    80: "Rain showers",
    81: "Heavy rain showers",
    82: "Violent rain showers",
    95: "Thunderstorm"
  };
  return map[code] || "Current conditions";
}