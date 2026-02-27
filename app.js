const cityInput = document.getElementById("cityInput");
const searchBtn = document.getElementById("searchBtn");
const weatherDisplay = document.getElementById("weatherDisplay");

const API_KEY = "854d418da25cf3c5ca425153975d0ce5";

// Fetch Weather Function (Async/Await)
async function getWeather(city) {
  try {
    showLoading();
    searchBtn.disabled = true;

    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
    );

    displayWeather(response.data);

  } catch (error) {
    showError("City not found. Please try again.");
  } finally {
    searchBtn.disabled = false;
  }
}

// Display Weather Data
function displayWeather(data) {
  weatherDisplay.innerHTML = `
    <h2>${data.name}</h2>
    <p>🌡 Temperature: ${data.main.temp}°C</p>
    <p>🌥 Weather: ${data.weather[0].description}</p>
    <p>💧 Humidity: ${data.main.humidity}%</p>
    <p>🌬 Wind Speed: ${data.wind.speed} m/s</p>
  `;
}

// Show Error Message
function showError(message) {
  weatherDisplay.innerHTML = `
    <div class="error">
      ❌ ${message}
    </div>
  `;
}

// Show Loading Spinner
function showLoading() {
  weatherDisplay.innerHTML = `
    <div class="spinner"></div>
    <p>Fetching weather data...</p>
  `;
}

// Search Button Click Event
searchBtn.addEventListener("click", () => {
  const city = cityInput.value.trim();

  if (!city) {
    showError("Please enter a city name.");
    return;
  }

  getWeather(city);
  cityInput.value = "";
});

// Enter Key Support
cityInput.addEventListener("keypress", (event) => {
  if (event.key === "Enter") {
    searchBtn.click();
  }
});