import { apiKey } from "./cred.js";

const cityInput = document.querySelector('.city-input');
const searchButton = document.querySelector('.search-button');
const popup = document.querySelector('.popup');

let timeoutId;

async function checkWeather(lat, lon) {
  const weatherApiUrl = `https://api.openweathermap.org/data/2.5/weather?units=metric&lat=${lat}&lon=${lon}&appid=${apiKey}`;
  const response = await fetch(weatherApiUrl);
  const WeatherData = await response.json();
  console.log(WeatherData);
  return WeatherData;
}

async function locateCity(city) {
  const geoApiUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${city}&appid=${apiKey}`;
  const response = await fetch(geoApiUrl);
  const geoData = await response.json();
  const {lat, lon, name, country} = geoData[0];
  return {lat:lat, lon:lon, cityName:name, country:country};
}

function updateDom(WeatherData, city, country, imgUrl) {
  document.querySelector('.city').innerHTML = city;
  document.querySelector('.country').innerHTML = country;
  document.querySelector('.temperature').innerHTML = Math.round(WeatherData.main.temp);
  document.querySelector('.humidity').innerHTML = WeatherData.main.humidity;
  document.querySelector('.wind-speed').innerHTML = WeatherData.wind.speed;
  document.querySelector('.feels-like').innerHTML = Math.round(WeatherData.main.feels_like);
  document.querySelector('.weather-icon-wrapper').innerHTML = `<img src="${imgUrl}" class="weather-icon">`;
}

function getWeatherIcon(weather, description) {
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
      if(description==='few clouds' 
      || description === 'scattered clouds') {
        imgUrl = './src/img/animated/cloudy-day-3.svg';
      } else if (description==='broken clouds' 
      || description === 'overcast clouds') {
        imgUrl = './src/img/animated/cloudy.svg';
      };
      break;
    default:
      imgUrl = './src/img/mist.svg';
      break;
  }
  console.log(description);
  return imgUrl;
}

async function renderWeatherInfo(city) {
  try {
    const {lat, lon, cityName, country} = await locateCity(city);
    const weatherData = await checkWeather(lat, lon);
    const imgUrl = getWeatherIcon(weatherData.weather[0].main, weatherData.weather[0].description);
    updateDom(weatherData, cityName, country, imgUrl);
    localStorage.setItem('city', cityName);
  } catch {
    popup.classList.remove('not-displayed');
    popup.classList.add('shake');
    if(timeoutId) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => {
      popup.classList.add('not-displayed');
      popup.classList.remove('shake');
      }, 2000);
  }
  
  
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