let searchbtn = document.getElementById("searchbtn");
let cityInput = document.getElementById("cityInput");
let apiKey = "6d21ab2c3c0e4f2cbdc123859252509";
let container = document.getElementById("weatherContainer");
let defaultcities = document.getElementById("defaultcities");
if (!container) {
  container = document.createElement("div");
  container.id = "weatherContainer";
  container.style.display = "flex";
  container.style.flexWrap = "wrap";
  container.style.gap = "15px";
  document.body.appendChild(container);
}

searchbtn.addEventListener("click", async () => {
  let cityName = cityInput.value.trim();

  if (cityName === "") {
    alert("Please enter a city name");
    return;
  }

  try {
    let weatherApi = await fetch(
      `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${cityName}&aqi=no`
    );
    let weatherData = await weatherApi.json();

    if (weatherData.error) {
      alert("City not found!");
      return;
    }
    const condition = weatherData.current.condition.text; // ex: "Partly cloudy"
    const temperature = weatherData.current.temp_c;
    const windSpeed = weatherData.current.wind_kph;
    const isDay = weatherData.current.is_day === 1;

    const weatherCard = `
      <div class="weather-card show" >
        <h2 class="city">${weatherData.location.name}</h2>
        <div class="icon">
        <img src="${getWeatherIcon(
          condition,
          temperature,
          isDay
        )}" alt="Weather Icon" class="weather-img"/>
        </div>
        <p class="condition"><strong>${condition}</strong></p>
        <p class="temperature">🌡️ Temperature: ${temperature}°C</p>
        <p class="wind">💨 Wind Speed: ${windSpeed} km/h</p>
      </div>
    `;

    container.insertAdjacentHTML("beforeend", weatherCard);

    console.log(weatherData);
  } catch (err) {
    console.error(err);
    alert("Something went wrong. Check console for details.");
  }
});

function getWeatherIcon(condition, temperature, isDay) {
  const folder = "amcharts_weather_icons_1.0.0/animated/";

  condition = condition.toLowerCase();

  if (condition.includes("sunny") || condition.includes("clear")) {
    return folder + (isDay ? "day.svg" : "night.svg");
  }

  if (condition.includes("partly") || condition.includes("cloud")) {
    return folder + (isDay ? "cloudy-day-2.svg" : "cloudy-night-2.svg");
  }

  if (condition.includes("rain") || condition.includes("drizzle")) {
    return folder + (isDay ? "rainy-2.svg" : "rainy-7.svg");
  }

  if (condition.includes("snow")) {
    return folder + (isDay ? "snowy.gif" : "snowy.gif");
  }

  if (
    condition.includes("mist") ||
    condition.includes("fog") ||
    condition.includes("haze") ||
    condition.includes("moist")
  ) {
    return folder + "mist.gif";
  }

  if (condition.includes("overcast")) {
    return folder + "overcast.gif";
  }

  if (condition.includes("thunder") || condition.includes("storm")) {
    return folder + (isDay ? "thunder.svg" : "thunder.svg");
  }

  return folder + "weather.svg";
}

window.addEventListener("load", () => {
  const defaultCities = ["delhi", "mumbai", "bangalore", "chennai"];
  defaultCities.forEach((city) => {
    cityInput.value = city;
    searchbtn.click();
  });
  cityInput.value = "";
});
searchbtn.addEventListener("click", (e) => {
  e.preventDefault();
  const city = cityInput.value.trim();
  if (!city) return;
  document.getElementById("weatherContainer").innerHTML = "";
  getWeather(city);
});
