import { apiKey } from "./cred.js";

const cityInput = document.querySelector('.city-input');
const searchButton = document.querySelector('.search-button');


async function checkWeather(lat, lon) {
  const weatherApiUrl = `https://api.openweathermap.org/data/2.5/weather?units=metric&lat=${lat}&lon=${lon}&appid=${apiKey}`;
  const response = await fetch(weatherApiUrl);
  const WeatherData = await response.json();
  console.log(WeatherData);
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

function getWeatherIcon(weather) {
  let imgUrl = '';
  switch (weather) {
    case 'Thunderstorm':
      imgUrl = './src/img/animated/thunder.svg';
      break;
    case 'Drizzle':
      imgUrl = './src/img/animated/rainy-4.svg';
      break;
    case 'Rain':
      imgUrl = './src/img/animated/rainy-6.svg';
      break;
    case 'Snow':
      imgUrl = './src/img/animated/snowy-6.svg';
      break;
    case 'Clear':
      imgUrl = './src/img/animated/day.svg';
      break;
    case 'Clouds':
      imgUrl = './src/img/animated/cloudy.svg';
      break;
    default:
      imgUrl = './src/img/search.png';
      break;
  }
  return imgUrl;
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



