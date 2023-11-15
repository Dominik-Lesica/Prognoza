import { apiKey } from "./cred.js";

const cityInput = document.querySelector('.city-input');
const searchButton = document.querySelector('.search-button');


async function checkWeather(lat, lon) {
  const weatherApiUrl = `https://api.openweathermap.org/data/2.5/weather?units=metric&lat=${lat}&lon=${lon}&appid=${apiKey}`;

  const response = await fetch(weatherApiUrl);
  const WeatherData = await response.json();
  return WeatherData;
}

async function locateCity(city) {
  try {
    const geoApiUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${city}&appid=${apiKey}`;
    const response = await fetch(geoApiUrl);
    const geoData = await response.json();
    const {lat, lon, name} = geoData[0];
    return {lat:lat, lon:lon, city:name};
  } catch {
    alert('Not a real city');
  }
}

function renderWeatherInfo(WeatherData, city) {
  document.querySelector('.city').innerHTML = city;
  document.querySelector('.temperature').innerHTML = Math.round(WeatherData.main.temp);
  document.querySelector('.humidity').innerHTML = WeatherData.main.humidity;
  document.querySelector('.wind-speed').innerHTML = WeatherData.wind.speed;
}


searchButton.addEventListener('click', async () => {
  const {lat, lon, city} = await locateCity(cityInput.value);
  const weatherData = await checkWeather(lat, lon);
  renderWeatherInfo(weatherData, city);
});


