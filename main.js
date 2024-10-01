import './global.css';
import axios from 'axios';

const content = document.getElementById('content');
const searchBar = document.getElementById('searchBar');
let weatherData = [];

const loadForecast = async (city) => {
  try {
    // Step 1: Get latitude and longitude using Geocoding API
    const geoResponse = await axios.get(
      `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=e479981d2e9be2d6aac75e850883c299`
    );

    if (geoResponse.data.length === 0) {
      throw new Error('City not found');
    }

    const { lat, lon } = geoResponse.data[0];

    // Step 2: Get the weather data using the One Call API 3.0
    const endpoint = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=e479981d2e9be2d6aac75e850883c299`
    );

    weatherData = endpoint;

    // eslint-disable-next-line
    displayForecast(weatherData);
  } catch (err) {
    // eslint-disable-next-line
    console.error(err);
  }
};

loadForecast('Lisabon');

searchBar.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    loadForecast(searchBar.value);
  }
});

const displayForecast = (forecast) => {
  const htmlString = `
  <div>
  <p class="text-2xl font-light">Weather in ${forecast.data.name}</p>
  <h1 class="text-8xl py-2 m-2 font-bold">${Math.round(forecast.data.main.temp)}&#x2103;</h1>
   <div class="flex items-center space-x-3 py-1 text-lg font-bold">
  <img src="https://openweathermap.org/img/wn/${forecast.data.weather[0].icon}.png"/>
  <p>${forecast.data.weather[0].description}</p>
  </div>
  
    <ul class="space-y-3 mt-3 font-extrabold text-lg">
      <li>Wind Speed:<span class="text-lg  ml-2">${forecast.data.wind.speed}</span></li>
      <li>Visibility:<span class="ml-2">${Math.round(forecast.data.visibility)}km</span></li>
      <li>Feels Like:<span class=" ml-2">${Math.round(forecast.data.main.feels_like)}&#x2103;</span></li>
      <li>Pressure:<span class=" ml-2">${forecast.data.main.pressure}</span></li>
      <li>Humidity:<span class=" ml-2">${forecast.data.main.humidity}&#x25;</span></li>
    </ul>
    <p class="mt-6 text-xs text-yellow-300">Powered by Open Weather API</p>
</div>`;
  content.innerHTML = htmlString;
};
