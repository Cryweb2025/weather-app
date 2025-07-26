const cityEl = document.getElementById("city");
const temperature = document.getElementById("temperature");
const gusts = document.getElementById("gusts");
const wind = document.getElementById("wind");
const weatherCode = document.getElementById("weather-code");
const todayTempMax = document.getElementById("today-temp-max");
const todayTempMin = document.getElementById("today-temp-min");
const todayWindSpeedMax = document.getElementById("wind-speed-max");
const todayGustsMax = document.getElementById("wind-gusts-max");
const todayRain = document.getElementById("rain-current");
const todayPreHours = document.getElementById("pre-hours-today");
const todayPreProbability = document.getElementById("pre-%-today");
const todayPreSum = document.getElementById("pre-sum-today");
const currentDate = document.getElementById("current-date");
const isDayOrNight = document.getElementById("is-don");
const sunSet = document.getElementById("sunset");
const sunRise = document.getElementById("sunrise");
const weatherImage = document.getElementById("weather-img");

document.getElementById("year").textContent = new Date().getFullYear();

async function fetchWeather() {
  const { data } = await axios.get(
    "https://api.bigdatacloud.net/data/reverse-geocode-client"
  );
  console.log(data);
  const { city, latitude, longitude } = data;
  console.log(city, latitude, longitude);

  cityEl.textContent += " " + city;

  fetchWeatherLocation(latitude, longitude);
}

fetchWeather();

async function fetchWeatherLocation(latitude, longitude) {
  const { data } = await axios.get(
    // `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m&current=temperature_2m,wind_speed_10m,wind_direction_10m,wind_gusts_10m,weather_code`
    `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=temperature_2m_max,temperature_2m_min,sunset,sunrise,uv_index_max,uv_index_clear_sky_max,sunshine_duration,daylight_duration,wind_gusts_10m_max,wind_speed_10m_max,wind_direction_10m_dominant,apparent_temperature_max,apparent_temperature_min,weather_code,et0_fao_evapotranspiration,shortwave_radiation_sum,precipitation_probability_max,precipitation_hours,precipitation_sum,snowfall_sum,showers_sum,rain_sum&hourly=temperature_2m&current=temperature_2m,wind_speed_10m,wind_direction_10m,wind_gusts_10m,weather_code,rain,is_day&timezone=auto`
  );
  console.log(data);

  const { current_units, current, daily, daily_units } = data;
  const {
    temperature_2m,
    wind_gusts_10m,
    wind_speed_10m,
    weather_code,
    rain,
    is_day,
  } = current;

  const {
    temperature_2m: tempUnit,
    wind_gusts_10m: gustsUnit,
    wind_speed_10m: speedUnit,
    rain: rainCurrentUnit,
  } = current_units;

  const {
    temperature_2m_max,
    temperature_2m_min,
    wind_speed_10m_max,
    wind_gusts_10m_max,
    precipitation_sum,
    precipitation_hours,
    precipitation_probability_max,
    time,
    sunset,
    sunrise,
  } = daily;

  const {
    temperature_2m_max: tempMaxUnit,
    temperature_2m_min: tempMinUnit,
    precipitation_hours: preHoursUnit,
    precipitation_probability_max: preProMaxUnit,
    precipitation_sum: preSumUnit,
    sunset: sunSetUnit,
    sunrise: sunRiseUnit,
  } = daily_units;

  let wmo = checkWmoCode(weather_code);

  // Current
  weatherCode.textContent = wmo;
  temperature.textContent += " " + temperature_2m + " " + tempUnit;
  gusts.textContent += " " + wind_gusts_10m + " " + gustsUnit;
  wind.textContent += " " + wind_speed_10m + " " + speedUnit;
  isDayOrNight.textContent = checkIsDay(is_day);
  currentDate.textContent = time[0];

  // Today max/min temp
  todayTempMax.textContent += " " + temperature_2m_max[0] + " " + tempMaxUnit;
  todayTempMin.textContent += " " + temperature_2m_min[0] + " " + tempMinUnit;

  // Today max wind
  todayWindSpeedMax.textContent +=
    " " + wind_speed_10m_max[0] + " " + speedUnit;
  todayGustsMax.textContent += " " + wind_gusts_10m_max[0] + " " + gustsUnit;

  // Precipitation
  todayRain.textContent += " " + rain + " " + rainCurrentUnit;
  todayPreHours.textContent +=
    " " + precipitation_hours[0] + " " + preHoursUnit;
  todayPreProbability.textContent +=
    " " + precipitation_probability_max[0] + " " + preProMaxUnit;
  todayPreSum.textContent += " " + precipitation_sum[0] + " " + preSumUnit;

  // Sun today
  sunRise.textContent = sunrise[0].split("T")[1] + " AM";
  sunSet.textContent = sunset[0].split("T")[1] + " PM";

  //   console.log(wmo);
}

function checkWmoCode(weather_code) {
  let wmoValue;
  switch (weather_code) {
    case 0:
      weatherImage.style.backgroundImage = "url('../assets/img/clear-sky.png')";
      return (wmoValue = "Clear sky");
    case 1:
      weatherImage.style.backgroundImage =
        "url('../assets/img/mainly-clear.png')";
      return (wmoValue = "Mainly clear");
    case 2:
      weatherImage.style.backgroundImage =
        "url('../assets/img/partly-cloudy.png')";
      return (wmoValue = "Partly cloudy");
    case 3:
      weatherImage.style.backgroundImage = "url('../assets/img/overcast.png')";
      return (wmoValue = "Overcast");
    case 45:
      return (wmoValue = "Fog");
    case 48:
      return (wmoValue = "Depositing rime fog");
    case 51:
      return (wmoValue = "Drizzle: Light");
    case 53:
      return (wmoValue = "Drizzle: Moderate");
    case 55:
      return (wmoValue = "Drizzle: Dense intensity");
    case 56:
      return (wmoValue = "Freezing Drizzle: Light");
    case 57:
      return (wmoValue = "Freezing Drizzle: Dense intensity");
    case 61:
      weatherImage.style.backgroundImage =
        "url('../assets/img/rain-slight.png')";
      return (wmoValue = "Rain: Slight");
    case 63:
      weatherImage.style.backgroundImage =
        "url('../assets/img/rain-moderate.png')";
      return (wmoValue = "Rain: Moderate");
    case 65:
      weatherImage.style.backgroundImage =
        "url('../assets/img/rain-heavy.png')";
      return (wmoValue = "Rain: Heavy intensity");
    case 66:
      return (wmoValue = "Freezing Rain: Light");
    case 67:
      return (wmoValue = "Freezing Rain: Heavy intensity");
    case 71:
      return (wmoValue = "Snow fall: Slight");
    case 73:
      return (wmoValue = "Snow fall: Moderate");
    case 75:
      return (wmoValue = "Snow fall: Heavy intensity");
    case 77:
      return (wmoValue = "Snow grains");
    case 80:
      return (wmoValue = "Rain showers: Slight");
    case 81:
      return (wmoValue = "Rain showers: Moderate");
    case 82:
      return (wmoValue = "Rain showers: Violent");
    case 85:
      return (wmoValue = "Snow showers slight");
    case 86:
      return (wmoValue = "Snow showers heavy");
    case 95:
      return (wmoValue = "Thunderstorm: Slight or moderate");
    case 96:
      return (wmoValue = "Thunderstorm with slight");
    case 99:
      return (wmoValue = "Thunderstorm: Heavy hail");
    default:
      return (wmoValue = "Error fetch weather code!");
  }
}

function checkIsDay(isDay) {
  if (isDay) return " is Day";
  else return " is Night";
}
