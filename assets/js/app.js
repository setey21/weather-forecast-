import { getForecast, searchCities } from "./weather.js";
import {
  hideCityOptions,
  renderForecast,
  setLoading,
  showCityOptions,
  showEmptyResults,
  showError,
  showInitialState,
  showStatus
} from "./ui.js";

const form = document.getElementById("search-form");
const cityInput = document.getElementById("city-input");
const cityOptions = document.getElementById("city-options");

let matchingCities = [];
let activeRequest;

function getErrorMessage(error) {
  if (error instanceof TypeError) {
    return "We couldn’t connect to the weather service. Check your internet connection and try again.";
  }
  return error instanceof Error ? error.message : "Something went wrong while loading the forecast.";
}

async function loadCityWeather(city, signal) {
  const forecast = await getForecast(city.latitude, city.longitude, signal);
  renderForecast(forecast, city);
}

async function handleSearch(event) {
  event.preventDefault();
  const cityName = cityInput.value.trim();

  if (!cityName) {
    showStatus("Please enter a city name before searching.", "error");
    cityInput.focus();
    return;
  }

  activeRequest?.abort();
  const controller = new AbortController();
  activeRequest = controller;
  setLoading(true);
  matchingCities = [];
  document.getElementById("weather-content").hidden = true;

  try {
    const cities = await searchCities(cityName, controller.signal);
    if (controller.signal.aborted) return;

    if (cities.length === 0) {
      showEmptyResults(cityName);
      return;
    }

    if (cities.length > 1) {
      matchingCities = cities;
      showCityOptions(cities);
      showStatus("Select the city you’re looking for.", "info");
      return;
    }

    await loadCityWeather(cities[0], controller.signal);
  } catch (error) {
    if (error.name !== "AbortError") showError(getErrorMessage(error));
  } finally {
    if (activeRequest === controller) {
      setLoading(false);
      activeRequest = undefined;
    }
  }
}

async function handleCitySelection(event) {
  const button = event.target.closest("button[data-city-index]");
  if (!button || !cityOptions.contains(button)) return;

  const selectedCity = matchingCities[Number(button.dataset.cityIndex)];
  if (!selectedCity) return;

  activeRequest?.abort();
  const controller = new AbortController();
  activeRequest = controller;
  setLoading(true);

  try {
    await loadCityWeather(selectedCity, controller.signal);
  } catch (error) {
    if (error.name !== "AbortError") showError(getErrorMessage(error));
  } finally {
    if (activeRequest === controller) {
      setLoading(false);
      activeRequest = undefined;
    }
  }
}

form.addEventListener("submit", handleSearch);
cityOptions.addEventListener("click", handleCitySelection);
showInitialState();
