class WeatherApp {
  constructor() {
    this.apiKey = "YOUR_API_KEY";
    this.cityInput = document.getElementById("cityInput");
    this.searchBtn = document.getElementById("searchBtn");
    this.weatherDisplay = document.getElementById("weatherDisplay");
    this.forecastContainer = document.getElementById("forecastContainer");
    this.recentContainer = document.getElementById("recentSearches");
    this.clearBtn = document.getElementById("clearHistory");

    this.init();
  }

  init() {
    this.searchBtn.addEventListener("click", () => {
      const city = this.cityInput.value.trim();
      if (city) this.getWeather(city);
    });

    this.clearBtn.addEventListener("click", () => this.clearHistory());

    this.loadRecentSearches();
    this.loadLastCity();
  }

  async getWeather(city) {
    try {
      this.weatherDisplay.innerHTML = "Loading...";

      const weatherRes = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${this.apiKey}&units=metric`
      );
      const weatherData = await weatherRes.json();

      if (weatherData.cod !== 200) {
        this.weatherDisplay.innerHTML = "City not found!";
        return;
      }

      const forecastRes = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${this.apiKey}&units=metric`
      );
      const forecastData = await forecastRes.json();

      this.displayWeather(weatherData);
      this.displayForecast(forecastData);

      this.saveRecentSearch(city);
      localStorage.setItem("lastCity", city);

    } catch (error) {
      this.weatherDisplay.innerHTML = "Error fetching data.";
      console.error(error);
    }
  }

  displayWeather(data) {
    this.weatherDisplay.innerHTML = `
      <h2>${data.name}</h2>
      <p>🌡 Temperature: ${data.main.temp}°C</p>
      <p>🌥 Weather: ${data.weather[0].description}</p>
    `;
  }

  displayForecast(data) {
    this.forecastContainer.innerHTML = "";

    const daily = data.list.filter(item =>
      item.dt_txt.includes("12:00:00")
    );

    daily.slice(0, 5).forEach(day => {
      const card = document.createElement("div");
      card.className = "forecast-card";
      card.innerHTML = `
        <p>${new Date(day.dt_txt).toLocaleDateString()}</p>
        <p>${day.main.temp}°C</p>
        <p>${day.weather[0].description}</p>
      `;
      this.forecastContainer.appendChild(card);
    });
  }

  loadRecentSearches() {
    const searches = JSON.parse(localStorage.getItem("recentSearches")) || [];
    this.displayRecentSearches(searches);
  }

  saveRecentSearch(city) {
    let searches = JSON.parse(localStorage.getItem("recentSearches")) || [];

    city = city.charAt(0).toUpperCase() + city.slice(1).toLowerCase();

    searches = searches.filter(item => item !== city);
    searches.unshift(city);

    if (searches.length > 5) searches.pop();

    localStorage.setItem("recentSearches", JSON.stringify(searches));
    this.displayRecentSearches(searches);
  }

  displayRecentSearches(searches) {
    this.recentContainer.innerHTML = "";

    searches.forEach(city => {
      const btn = document.createElement("button");
      btn.textContent = city;
      btn.addEventListener("click", () => this.getWeather(city));
      this.recentContainer.appendChild(btn);
    });
  }

  loadLastCity() {
    const lastCity = localStorage.getItem("lastCity");
    if (lastCity) {
      this.getWeather(lastCity);
    }
  }

  clearHistory() {
    localStorage.removeItem("recentSearches");
    localStorage.removeItem("lastCity");
    this.recentContainer.innerHTML = "";
  }
}

new WeatherApp();