const apiKey = "a687526e092caa2c6b084ba2e1105cc8"; // Replace this

const city = "London";

const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

axios.get(url)
    .then(function(response) {

        const data = response.data;

        document.getElementById("city").textContent = data.name;
        document.getElementById("temperature").textContent =
            "Temperature: " + data.main.temp + "°C";
        document.getElementById("description").textContent =
            data.weather[0].description;

        const iconCode = data.weather[0].icon;
        document.getElementById("icon").src =
            "https://openweathermap.org/img/wn/" + iconCode + "@2x.png";

        console.log("Weather data:", data);

    })
    .catch(function(error) {
        console.log("Error:", error);
        alert("Something went wrong. Check console.");
    });