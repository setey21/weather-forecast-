# Weather Forecast

A responsive, no-build weather dashboard made with HTML, CSS, and vanilla JavaScript. It uses the free Open-Meteo geocoding and forecast APIs; no API key or backend is needed.

## Run it locally

1. Open the `weather-forecast-app` folder in Visual Studio Code.
2. Install the **Live Server** extension if it is not already installed.
3. Right-click `index.html` and choose **Open with Live Server**.
4. Search for a city, such as **Addis Ababa**. Choose a result if more than one place matches.

ES modules and browser `fetch()` work best from a local web server rather than opening the HTML file directly. The app requires an internet connection to contact Open-Meteo. If Google Fonts cannot be reached, the page uses its system font fallbacks.

## Project files

- `index.html` contains the accessible page structure, search form, live status region, forecast areas, and module/style links.
- `assets/css/style.css` styles the dashboard and adapts it to desktop, tablet, and mobile screens. It also includes visible keyboard focus and reduced-motion support.
- `assets/js/app.js` validates searches, coordinates geocoding and forecasts, handles city selection, and cancels outdated requests.
- `assets/js/weather.js` fetches city matches and weather data, checks HTTP responses, and maps WMO weather codes to descriptions and icons.
- `assets/js/ui.js` renders safe text-based status, city options, current conditions, and five-day forecast cards.
- `assets/images/weather-icon.svg` is the app's original favicon.

## Data and attribution

Weather and geocoding data are provided by [Open-Meteo](https://open-meteo.com/). Learn more in the [Open-Meteo documentation](https://open-meteo.com/en/docs) and the [geocoding API documentation](https://open-meteo.com/en/docs/geocoding-api).

## Try these cases

- **Addis Ababa**: check the current weather and all five forecast days.
- **Another city**: for example, search for Tokyo or London.
- **Multiple matches**: search a common name such as Springfield, then choose the correct place.
- **Unknown city**: search for a made-up name to see the no-results message.
- **Empty input**: submit without typing to see the validation message.
- **API/network failure**: disconnect from the internet or use browser developer tools to block an Open-Meteo request, then search again to see the error message.
- **Mobile layout**: use the browser's responsive/device toolbar, or resize the window below 480 pixels.
