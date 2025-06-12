# Salzburg Smart City Services Map

An interactive web application that displays various smart city services across Salzburg, Austria. The application provides a user-friendly interface to explore and locate bicycle rental stations, EV charging points, recycling facilities, and public WiFi hotspots.

## Features

- Interactive map centered on Salzburg using OpenStreetMap
- Multiple service layers:
  - Bicycle Rental Stations
  - EV Charging Stations
  - Recycling Points
  - Public WiFi Hotspots
- Layer toggles for each service type
- Search functionality with filtering by service type
- Detailed popups with service information
- Responsive design for desktop and mobile devices
- Modern UI with smooth animations and transitions

## Technologies Used

- HTML5
- CSS3
- JavaScript (ES6+)
- Leaflet.js for interactive mapping
- Font Awesome for icons
- Google Fonts (Roboto and Montserrat)

## Project Structure

```
├── index.html          # Main HTML file
├── css/
│   └── style.css      # Main stylesheet
├── js/
│   ├── leaflet.js     # Leaflet library
│   └── main.js        # Main application logic
└── data/              # GeoJSON data files
    ├── Bicycle_rental.json
    ├── Bicycle_rental_features.json
    ├── Charging_stations.json
    ├── Charging_stations_features.geojson
    ├── Public_internet.geojson
    ├── Public_internet_features.geojson
    ├── Recycling.geojson
    └── recycling_features.json
```

## Getting Started

### Prerequisites

- Node.js and npm installed on your system
- A modern web browser (Chrome, Firefox, Safari, or Edge)

### Running the Project

1. Clone or download this repository
2. Install dependencies:
   ```bash
   npm install -g serve
   ```
3. Start the development server:
   ```bash
   serve .
   ```
4. Open your web browser and navigate to `http://localhost:3000`

### Using the Application

1. The map will load centered on Salzburg
2. Use the control panel on the left to:
   - Toggle different service layers
   - Search for specific locations
   - Filter services by type
3. Click on any marker to view detailed information about the service
4. Use the search box to find specific locations or services
5. Use the layer toggles to show/hide different types of services

## Data Sources

The application uses GeoJSON data files containing information about various smart city services in Salzburg. The data is stored in the `data/` directory and includes:

- Bicycle rental locations
- EV charging stations
- Recycling points
- Public WiFi hotspots

## License

This project is open source and available under the MIT License. 