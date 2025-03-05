# React + Vite

Weather App

Overview

A Weather App built with React and Vite, providing real-time weather updates using the Open-Meteo API. It allows users to search for a location and view hourly and daily forecasts.

Features

Real-time Weather Data: Fetches weather information from Open-Meteo API.

Hourly & Daily Forecasts: Displays temperature, humidity, wind speed, and other weather parameters.

Search Functionality: Allows users to look up weather for any location.

Unit Conversion: Supports switching between Celsius and Fahrenheit.

Clean UI: Built with reusable components for a structured and maintainable codebase.

Tech Stack

Frontend: React (v19.0.0) with Vite for fast builds.

Styling: Tailwind CSS (optional).

State Management: React Hooks.

Date Handling: Moment.js.

API Integration: Open-Meteo API.

Project Structure

/weather-app
│── src/
│ ├── components/ # Main React components
│ ├── components/ui/ # Reusable UI components
│ ├── utils.js # Utility functions
│ ├── App.jsx # Main application component
│ ├── index.js # Entry point
│
├── public/
├── package.json
├── vite.config.js

Installation

git clone https://github.com/yourusername/weather-app.git
cd weather-app
npm install

Running the App

npm run dev

Building for Production

npm run build

Linting

npm run lint

API Usage

This app fetches weather data from the Open-Meteo API. Ensure you follow API rate limits and check their documentation for additional parameters.

Future Improvements

Implement dark mode.

Add geolocation-based weather fetching.

Improve UI responsiveness.

Cache API responses for better performance.

Contributing

Feel free to fork the repo and submit pull requests. Contributions are welcome!

License

This project is licensed under the MIT License.
