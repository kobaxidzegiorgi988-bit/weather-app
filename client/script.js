'use strict';

// 1. DOM ელემენტების ზუსტი არჩევა ID-ებისა და კლასების მიხედვით
// ვიყენებთ getElementById, რადგან ID უნიკალურია და ეს მეთოდი ყველაზე სწრაფია
const searchInput = document.getElementById('city-input');
const searchButton = document.getElementById('search-btn');

// ვიყენებთ querySelector-ს კლასებისთვის
const cityNameEl = document.querySelector('.city');
const temperatureEl = document.querySelector('.temperature');
const descriptionEl = document.querySelector('.description');
const weatherIconEl = document.querySelector('.weather-icon');
const feelsLikeEl = document.querySelector('.feels-like');
const humidityEl = document.querySelector('.humidity');
const windEl = document.querySelector('.wind');

// 2. ღილაკზე დაჭერის "მოსმენა"
searchButton.addEventListener('click', () => {
  // 1) Get City Value
  const city = searchInput.value.trim();
  if (!city) {
    alert('Please enter a city name');
    return;
  }

  // 2) API Details
 
  const apiUrl = `http://localhost:3000/api/weather?city=${encodeURIComponent(city)}`;

  // 3) Fetch Data
  fetch(apiUrl)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      return response.json();
    })
    // 4) Handle Success
    .then((data) => {
      console.log(data);
      updateWeatherUI(data);
    })
    // 5) Handle Errors
    .catch((error) => {
      console.error(error);
      alert('Could not fetch weather data. Please check the city name.');
    });
});

// 6) Create the UI Update Function
function updateWeatherUI(data) {
  if (cityNameEl) {
    cityNameEl.textContent = data?.name ?? '';
  }
  if (temperatureEl) {
    const temp = Math.round(Number(data?.main?.temp));
    temperatureEl.textContent = Number.isFinite(temp) ? `${temp}°` : '--°';
  }
  if (descriptionEl) {
    let desc = data?.weather?.[0]?.description ?? '';
    // Capitalize the first letter
    if (desc.length > 0) {
      desc = desc.charAt(0).toUpperCase() + desc.slice(1);
    }
    descriptionEl.textContent = desc;
    
  }
  if (weatherIconEl) {
    const icon = data?.weather?.[0]?.icon;
    weatherIconEl.src = icon ? `https://openweathermap.org/img/wn/${icon}@2x.png` : '';
    weatherIconEl.alt = data?.weather?.[0]?.description || 'Weather icon';
  }
  if (feelsLikeEl) {
    const feels = Math.round(Number(data?.main?.feels_like));
    feelsLikeEl.textContent = Number.isFinite(feels) ? `${feels}°` : '--°';
  }
  if (humidityEl) {
    const hum = Math.round(Number(data?.main?.humidity));
    humidityEl.textContent = Number.isFinite(hum) ? `${hum}%` : '--%';
  }
  if (windEl) {
    const windSpeed = Number(data?.wind?.speed);
    // Note: OpenWeatherMap wind speed is in m/s. UI label shows km/h.
    // We display km/h for consistency with the HTML label.
    const kmh = Math.round(windSpeed * 3.6);
    windEl.textContent = Number.isFinite(kmh) ? `${kmh} km/h` : '-- km/h';
  }
}