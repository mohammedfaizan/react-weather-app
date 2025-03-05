import CardLayout from "./ui/CardLayout";
import Cloud from "../assets/images/cloud.svg";
import Search from "../assets/images/search.svg";
import Sun from "../assets/images/sun.svg";
import Temperature from "../assets/images/temperature.svg";
import Eye from "../assets/images/eye.svg";
import Thermomini from "../assets/images/temperature-mini.svg";
import Water from "../assets/images/water.svg";
import Windy from "../assets/images/windy.svg";
import { weatherCodesMapping } from "../utils";
import moment from "moment";
import { useState } from "react";
import { useEffect } from "react";

export default function DefaultScreen({
  currentWeatherData = [],
  forecastLocation,
  onHandleClick,
}) {
  console.log("Current Weather Data:", currentWeatherData);

  const [searchCity, setSearchCity] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  const fetchSuggestions = async (label) => {
    if (!label) return;
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search.php?q=${label}&accept-language=en-US%2Cen&format=jsonv2`
      );
      const datas = await res.json();
      setSuggestions(
        datas.map((data) => ({
          label: data?.display_name,
          lat: data.lat,
          lon: data.lon,
        }))
      );
    } catch (error) {
      console.error("Error fetching suggestions:", error);
    }
  };

  useEffect(() => {
    const timeout = setTimeout(() => fetchSuggestions(searchCity), 500);
    return () => clearTimeout(timeout);
  }, [searchCity]);

  // Ensure we have weather data before accessing its properties
  const weather = currentWeatherData[0]?.values;

  return (
    <div className="default-home-container">
      <CardLayout>
        <>
          <div className="default-card-city">
            <img src={Sun} alt="sunny" />
            <div>
              <p className="city-name">Ladakh</p>
              <p className="date-today">
                {moment(currentWeatherData[0]?.date).format("ddd DD/MM/YYYY")}
              </p>
            </div>
          </div>

          {weather ? (
            <>
              <div className="temp-container">
                <img
                  src={Temperature}
                  className="thermometer-img"
                  alt="temperature-icon"
                />
                <div>
                  <p style={{ fontSize: "144px" }}>
                    {parseFloat(weather.temperature2m || 0).toFixed(0)}
                  </p>
                  <p className="text-capitalize">Clear Sky</p>
                </div>
                <p
                  style={{
                    fontSize: "24px",
                    alignSelf: "start",
                    paddingTop: "45px",
                  }}
                >
                  °C
                </p>
              </div>

              <div className="weather-info-subtitle">
                <div className="flex">
                  <img src={Eye} alt="visibility" />
                  <p className="weather-params-label">Visibility</p>
                  <p>{weather.visibility ?? "N/A"}</p>
                </div>
                <p>|</p>
                <div className="flex">
                  <img src={Thermomini} alt="feels like" />
                  <p className="weather-params-label">Feels Like</p>
                  <p>{parseFloat(weather.temperature2m || 0).toFixed(0)}</p>
                </div>
              </div>

              <div className="weather-info-subtitle">
                <div className="flex">
                  <img src={Water} alt="humidity" />
                  <p className="weather-params-label">Humidity</p>
                  <p>{weather.humidity ?? "N/A"}</p>
                </div>
                <p>|</p>
                <div className="flex">
                  <img src={Windy} alt="wind" />
                  <p className="weather-params-label">Wind</p>
                  <p>
                    {weather.windSpeed ? weather.windSpeed.toFixed(0) : "N/A"}
                  </p>
                </div>
              </div>
            </>
          ) : (
            <p style={{ textAlign: "center", fontSize: "18px", color: "#888" }}>
              No weather data available.
            </p>
          )}
        </>
      </CardLayout>

      <CardLayout>
        <div className="search-card">
          <div className="flex justify-center">
            <img src={Cloud} alt="cloud image" />
          </div>

          <div className="search-city-container">
            <img src={Search} alt="search-icon" />
            <input
              type="text"
              className="city-input"
              placeholder="Search City..."
              onChange={(e) => setSearchCity(e.target.value)}
            />
          </div>

          <div className="search-city-suggestions">
            {suggestions.length > 0 &&
              suggestions.map((suggestion, index) =>
                index <= 4 ? (
                  <p
                    className="suggested-label"
                    key={index}
                    onClick={() => onHandleClick(suggestion)}
                  >
                    {suggestion.label}
                  </p>
                ) : null
              )}
          </div>
        </div>
      </CardLayout>
    </div>
  );
}
