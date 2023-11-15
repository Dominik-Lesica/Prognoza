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
    const {lat, lon, name, country} = geoData[0];
    return {lat:lat, lon:lon, cityName:name, country:country};
  } catch {
    alert('Not a real city');
  }
}

function updateDom(WeatherData, city, country) {
  document.querySelector('.city').innerHTML = city;
  document.querySelector('.country').innerHTML = country;
  document.querySelector('.temperature').innerHTML = Math.round(WeatherData.main.temp);
  document.querySelector('.humidity').innerHTML = WeatherData.main.humidity;
  document.querySelector('.wind-speed').innerHTML = WeatherData.wind.speed;
  document.querySelector('.feels-like').innerHTML = Math.round(WeatherData.main.feels_like);
}

async function renderWeatherInfo(city) {
  const {lat, lon, cityName, country} = await locateCity(city);
  const weatherData = await checkWeather(lat, lon);
  updateDom(weatherData, cityName, country);
  localStorage.setItem('city', cityName);
}

renderWeatherInfo(localStorage.getItem('city') || 'Zagreb');

searchButton.addEventListener('click', () => {
  renderWeatherInfo(cityInput.value);
});

cityInput.addEventListener('keydown', (e) => {
  if(e.key === 'Enter') {
    renderWeatherInfo(cityInput.value);
  };
});



