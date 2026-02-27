function WeatherApp() {
    this.cityInput = document.getElementById("cityInput");
    this.searchBtn = document.getElementById("searchBtn");
    this.weatherDisplay = document.getElementById("weatherDisplay");
    this.forecastContainer = document.getElementById("forecastContainer");
    this.API_KEY = "854d418da25cf3c5ca425153975d0ce5";
}

WeatherApp.prototype.init = function () {
    this.searchBtn.addEventListener("click", this.handleSearch.bind(this));
    this.cityInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter") this.handleSearch();
    });

    this.showWelcome();
};

WeatherApp.prototype.showWelcome = function () {
    this.weatherDisplay.innerHTML = `<p>Search for a city to see weather 🌍</p>`;
    this.forecastContainer.innerHTML = "";
};

WeatherApp.prototype.handleSearch = function () {
    const city = this.cityInput.value.trim();
    if (!city) {
        this.showError("Please enter a city name.");
        return;
    }
    this.getWeather(city);
    this.cityInput.value = "";
};

WeatherApp.prototype.getWeather = async function (city) {
    try {
        this.showLoading();
        this.searchBtn.disabled = true;

        const weatherURL =
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${this.API_KEY}&units=metric`;

        const forecastURL =
            `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${this.API_KEY}&units=metric`;

        const [weatherRes, forecastRes] = await Promise.all([
            axios.get(weatherURL),
            axios.get(forecastURL)
        ]);

        this.displayWeather(weatherRes.data);

        const processedData = this.processForecastData(forecastRes.data.list);
        this.displayForecast(processedData);

    } catch (error) {
        this.showError("City not found. Please try again.");
    } finally {
        this.searchBtn.disabled = false;
    }
};

WeatherApp.prototype.displayWeather = function (data) {
    this.weatherDisplay.innerHTML = `
        <h2>${data.name}</h2>
        <p>🌡 ${data.main.temp}°C</p>
        <p>🌥 ${data.weather[0].description}</p>
        <p>💧 Humidity: ${data.main.humidity}%</p>
    `;
};

WeatherApp.prototype.processForecastData = function (list) {
    const dailyData = list.filter(item =>
        item.dt_txt.includes("12:00:00")
    );

    return dailyData.slice(0, 5);
};

WeatherApp.prototype.displayForecast = function (forecastData) {
    this.forecastContainer.innerHTML = "";

    forecastData.forEach(day => {
        const date = new Date(day.dt_txt);
        const dayName = date.toLocaleDateString("en-US", { weekday: "long" });

        const iconURL =
            `https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`;

        this.forecastContainer.innerHTML += `
            <div class="forecast-card">
                <h4>${dayName}</h4>
                <img src="${iconURL}" alt="weather icon">
                <p>${day.main.temp}°C</p>
                <p>${day.weather[0].description}</p>
            </div>
        `;
    });
};

WeatherApp.prototype.showLoading = function () {
    this.weatherDisplay.innerHTML = `
        <div class="spinner"></div>
        <p>Loading weather data...</p>
    `;
    this.forecastContainer.innerHTML = "";
};

WeatherApp.prototype.showError = function (message) {
    this.weatherDisplay.innerHTML = `<div class="error">${message}</div>`;
    this.forecastContainer.innerHTML = "";
};

const app = new WeatherApp();
app.init();