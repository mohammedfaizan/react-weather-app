import React from "react";
import { weatherCodesMapping } from "../../utils";
import moment from "moment";
import CardLayout from "./CardLayout";

function DayForecastCard({ date, data }) {
  return (
    <CardLayout>
      <div className="day-forecast-container">
        <p className="label-18">{moment(date).format("dddd")}</p>
        <p className="text-blue">{moment(date).format("MMM DD")}</p>
        <img
          src={weatherCodesMapping[data.weatherCode].img}
          width={48}
          height={48}
        />
        <p className="label-18">{data.weatherConition}</p>
        <p className="temp-range">
          {Math.floor(data.temperature2mMin)}-{" "}
          {Math.floor(data.temperature2mMax)}°C
        </p>
      </div>
    </CardLayout>
  );
}

export default DayForecastCard;
