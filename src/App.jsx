import "./style/index.css";
import "./App.css";
import Header from "./components/Header";
import DefaultScreen from "./components/DefaultScreen";
import { fetchWeatherApi } from "openmeteo";
import { useEffect } from "react";
import { weatherCodesMapping } from "./utils";
import { useState } from "react";
import SearchResult from "./components/SearchResult";

function App() {
  const [dailyForecast, setDailyForecast] = useState(null);
  const [hourlyForecast, setHourlyForecast] = useState(null);
  const [dataLoading, setDataLoading] = useState(false);
  const [showResultScreen, setShowResultScreen] = useState();
  const [forecastLocation, setForecastLocation] = useState({
    label: "ladakh",
    lat: 34.194,
    lng: 75.894,
  });

  function filterAndFlagClosetTime(data) {
    const currentDate = new Date();
    console.log(currentDate);
    const entries = Object.entries(data);
    const todayData = entries.filter(([dateString]) => {
      const date = new Date(dateString);

      return (
        date.getDate() === currentDate.getDate() &&
        date.getMonth() === currentDate.getMonth() &&
        date.getFullYear() === currentDate.getFullYear()
      );
    });

    console.log(todayData);

    let closestTimeIndex = 0;
    let closestTimeDiff = Math.abs(currentDate - new Date(todayData[0][0]));

    todayData.forEach(([dateString], index) => {
      const timeDiff = Math.abs(currentDate - new Date(dateString));
      if (timeDiff < closestTimeDiff) {
        closestTimeDiff = timeDiff;
        closestTimeIndex = index;
      }
    });

    const result = todayData.map(([dateString, values], index) => ({
      date: dateString,
      values,
      isClosestTime: index === closestTimeIndex,
    }));
    console.log(result);
    return result;
  }

  function processData(hourly, daily) {
    function convertTimeToObjectArray(times, values) {
      console.log(times);
      console.log(values);

      if (!times || !values || !values.weatherCode) {
        return {};
      }

      const obj = {};

      times.forEach((time, timeIndex) => {
        if (!time) return;
        const weatherProperties = {};

        Object.keys(values).forEach((property) => {
          if (values[property] && values[property][timeIndex] !== undefined) {
            weatherProperties[property] = values[property][timeIndex];
          }
        });

        const weatherCode = values.weatherCode?.[timeIndex];
        const weatherCondition = weatherCodesMapping[weatherCode]?.label;

        obj[time] = { ...weatherProperties, weatherCondition };
      });

      console.log(obj);
      return obj;
    }

    const dailyData = convertTimeToObjectArray(daily.time, {
      weatherCode: daily.weatherCode,
      temperature2mMax: daily.temperature2mMax,
      temperature2mMin: daily.temperature2mMin,
      apparentTemperatureMax: daily.apparentTemperatureMax,
      apparentTemperatureMin: daily.apparentTemperatureMin,
      sunset: daily.sunset,
      sunrise: daily.sunrise,
      uvIndexMax: daily.uvIndexMax,
      precipitationSum: daily.precipitationSum,
      windSpeed10mMax: daily.windSpeed10mMax,
      windDirection10mDominant: daily.windDirection10mDominant,
    });

    const hourlyFormatted = convertTimeToObjectArray(hourly.time, {
      temperature2m: hourly.temperature2m,
      visibility: hourly.visibility,
      windDirection10m: hourly.windDirection10m,
      apparentTemperature: hourly.apparentTemperature,
      precipitationProbability: hourly.precipitationProbability,
      humidity: hourly.relativeHumidity2m,
      windSpeed: hourly.windSpeed10m,
      weatherCode: hourly.weatherCode,
    });

    return {
      hourlyData: hourlyFormatted,
      dailyData: dailyData,
    };
  }

  const fetchWeather = async (lat, lon, switchResultScreen) => {
    try {
      const params = {
        latitude: lat ?? 34.194,
        longitude: lon ?? 75.894,
        hourly:
          "temperature_2m,weather_code,visibility,wind_direction_10m,apparent_temperature,precipitation_probability,relative_humidity_2m,wind_speed_10m",
        daily:
          "weather_code,temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,sunrise,sunset,uv_index_max,precipitation_sum,wind_speed_10m_max,wind_direction_10m_dominant",
      };

      const url = "https://api.open-meteo.com/v1/forecast";
      const responses = await fetchWeatherApi(url, params);

      // Helper function to form time ranges
      const range = (start, stop, step) =>
        Array.from(
          { length: (stop - start) / step },
          (_, i) => start + i * step
        );

      const response = responses[0];
      const utcOffsetSeconds = response.utcOffsetSeconds();

      // Process hourly data
      const hourly = response.hourly();
      const daily = response.daily();

      const weatherData = {
        hourly: {
          time: range(
            Number(hourly.time()),
            Number(hourly.timeEnd()),
            hourly.interval()
          ).map((t) => new Date((t + utcOffsetSeconds) * 1000)),
          temperature2m: hourly.variables(0).valuesArray(),
          weatherCode: hourly.variables(1).valuesArray(),
          visibility: hourly.variables(2).valuesArray(),
          windDirection10m: hourly.variables(3).valuesArray(),
          apparentTemperature: hourly.variables(4).valuesArray(),
          precipitationProbability: hourly.variables(5).valuesArray(),
          relativeHumidity2m: hourly.variables(6).valuesArray(),
          windSpeed10m: hourly.variables(7).valuesArray(),
        },
        daily: {
          time: range(
            Number(daily.time()),
            Number(daily.timeEnd()),
            daily.interval()
          ).map((t) => new Date((t + utcOffsetSeconds) * 1000)),
          weatherCode: daily.variables(0).valuesArray(),
          temperature2mMax: daily.variables(1).valuesArray(),
          temperature2mMin: daily.variables(2).valuesArray(),
          apparentTemperatureMax: daily.variables(3).valuesArray(),
          apparentTemperatureMin: daily.variables(4).valuesArray(),
          sunrise: daily.variables(5).valuesArray(),
          sunset: daily.variables(6).valuesArray(),
          uvIndexMax: daily.variables(7).valuesArray(),
          precipitationSum: daily.variables(8).valuesArray(),
          windSpeed10mMax: daily.variables(9).valuesArray(),
          windDirection10mDominant: daily.variables(10).valuesArray(),
        },
      };

      const { hourlyData, dailyData } = processData(
        weatherData.hourly,
        weatherData.daily
      );

      const filteredHourly = filterAndFlagClosetTime(hourlyData);
      setHourlyForecast(filteredHourly);
      setDailyForecast(dailyData);
      setDataLoading(false);

      if (switchResultScreen) {
        setShowResultScreen(true);
      }

      console.log("Processed Weather Data:", weatherData);
    } catch (error) {
      console.error("Error fetching weather data:", error);
    }
  };

  useEffect(() => {
    fetchWeather();
  }, []);

  const clickHandler = (searchItem) => {
    setDataLoading(true);
    setForecastLocation({
      label: searchItem.label,
      lat: searchItem.lat,
      lon: searchItem.lon,
    });

    fetchWeather(searchItem.lat, searchItem.lon, true);
  };
  return (
    <div className="app">
      <Header />
      <p className="copyright-text">&copy; 2025 WSA. All Rights reserved</p>
      {!dataLoading && !showResultScreen && (
        <DefaultScreen
          currentWeatherData={
            hourlyForecast?.length
              ? hourlyForecast.filter((hour) => hour.isClosestTime)
              : []
          }
          forecastLocation={forecastLocation}
          onHandleClick={clickHandler}
        />
      )}
      {showResultScreen && !dataLoading && (
        <SearchResult
          dailyForecast={dailyForecast}
          forecastLocation={forecastLocation}
          currentWeatherData={
            hourlyForecast?.length
              ? hourlyForecast.filter((hour) => hour.isClosestTime)
              : []
          }
          hourlyForecastData={hourlyForecast}
        />
      )}
    </div>
  );
}

export default App;
