import { getWeatherInfo } from "./weather.js";

const byId = (id) => document.getElementById(id);

function setText(id, value) {
  byId(id).textContent = value;
}

function formatValue(value, digits = 0) {
  return Number.isFinite(value) ? String(Math.round(value * (10 ** digits)) / (10 ** digits)) : "—";
}

function makeElement(tagName, className, text) {
  const element = document.createElement(tagName);
  if (className) element.className = className;
  if (text !== undefined) element.textContent = text;
  return element;
}

function formatDate(dateString, options) {
  if (typeof dateString !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
    return "Date unavailable";
  }

  const date = new Date(`${dateString}T12:00:00`);
  return Number.isNaN(date.getTime())
    ? "Date unavailable"
    : new Intl.DateTimeFormat(undefined, options).format(date);
}

export function setLoading(isLoading) {
  const button = byId("search-button");
  button.disabled = isLoading;
  button.querySelector("span").textContent = isLoading ? "Searching…" : "Search";
  byId("city-input").disabled = isLoading;
  if (isLoading) {
    showStatus("Finding your forecast…", "loading");
    hideCityOptions();
  }
}

export function showStatus(message, state = "info") {
  const status = byId("status-message");
  const icon = status.querySelector(".status-icon");
  status.className = `status-message status-${state}`;
  icon.textContent = state === "loading" ? "" : state === "error" ? "!" : state === "empty" ? "⌕" : "✦";
  status.setAttribute("aria-busy", String(state === "loading"));
  status.lastChild.textContent = ` ${message}`;
  status.hidden = false;
}

export function hideStatus() {
  byId("status-message").hidden = true;
}

export function showCityOptions(cities) {
  const container = byId("city-options");
  container.replaceChildren();

  cities.forEach((city, index) => {
    const details = [city.admin1, city.country].filter(Boolean).join(", ");
    const button = makeElement("button", "city-option");
    button.type = "button";
    button.dataset.cityIndex = String(index);

    const name = makeElement("span", "city-option-name", city.name);
    const location = makeElement("span", "city-option-detail", details || "Location details unavailable");
    const arrow = makeElement("span", "city-option-arrow", "→");
    arrow.setAttribute("aria-hidden", "true");
    button.append(name, location, arrow);
    container.append(button);
  });

  byId("city-options-section").hidden = false;
}

export function hideCityOptions() {
  byId("city-options-section").hidden = true;
  byId("city-options").replaceChildren();
}

export function renderForecast(data, city) {
  const current = data.current ?? {};
  const daily = data.daily ?? {};
  const weather = getWeatherInfo(current.weather_code);
  const locationParts = [city.name, city.admin1, city.country].filter(Boolean);

  setText("location-name", [...new Set(locationParts)].join(", "));
  setText("current-date", formatDate(current.time?.slice(0, 10), { weekday: "long", month: "long", day: "numeric" }));
  setText("current-icon", weather[1]);
  setText("current-condition", weather[0]);
  setText("current-temperature", formatValue(current.temperature_2m));
  setText("feels-like", formatValue(current.apparent_temperature));
  setText("humidity", formatValue(current.relative_humidity_2m));
  setText("wind-speed", formatValue(current.wind_speed_10m, 1));

  const forecastList = byId("forecast-list");
  forecastList.replaceChildren();
  const days = Array.isArray(daily.time) ? daily.time : [];

  days.slice(0, 5).forEach((date, index) => {
    const [description, icon] = getWeatherInfo(daily.weather_code?.[index]);
    const card = makeElement("article", "forecast-card");
    const day = makeElement("p", "forecast-day", formatDate(date, { weekday: "short" }));
    const dateLabel = makeElement("p", "forecast-date", formatDate(date, { month: "short", day: "numeric" }));
    const weatherIcon = makeElement("span", "forecast-icon", icon);
    weatherIcon.setAttribute("aria-hidden", "true");
    const condition = makeElement("p", "forecast-condition", description);
    const temperatures = makeElement("p", "forecast-temperatures");
    temperatures.append(
      makeElement("span", "forecast-high", `${formatValue(daily.temperature_2m_max?.[index])}°`),
      makeElement("span", "forecast-low", `${formatValue(daily.temperature_2m_min?.[index])}°`)
    );
    const precipitation = makeElement(
      "p",
      "forecast-precipitation",
      `Rain ${formatValue(daily.precipitation_probability_max?.[index])}%`
    );

    card.append(day, dateLabel, weatherIcon, condition, temperatures, precipitation);
    forecastList.append(card);
  });

  if (days.length === 0) {
    const emptyForecast = makeElement("p", "forecast-empty", "The five-day forecast is not available right now.");
    forecastList.append(emptyForecast);
  }

  hideCityOptions();
  hideStatus();
  byId("weather-content").hidden = false;
}

export function showError(message) {
  byId("weather-content").hidden = true;
  showStatus(message, "error");
}

export function showEmptyResults(cityName) {
  byId("weather-content").hidden = true;
  showStatus(`No cities found for “${cityName}”. Check the spelling and try again.`, "empty");
}

export function showInitialState() {
  byId("weather-content").hidden = true;
  hideCityOptions();
  showStatus("Search for a city to see your forecast.", "info");
}
