# IP Address Tracker

<p align="center">
  <img src="src/images/[screenshot]" width= "450">
</p>

## Overview

A front-end application to track and display IP address or domain details, including location, timezone, and ISP, with an interactive map. Built as part of the Frontend Mentor IP Address Tracker challenge, this project emphasizes robust logic and responsive design using vanilla JavaScript and Sass. Deployed live at [live link].

### Features

- Search for IP address or domain details using the Geo.ipify API.
- Display IP address, location (city, region), timezone, and ISP in a clean info panel.
- Interactive map powered by Leaflet to visualize the IP’s location.
- Input validation for IPv4 addresses and domains, with private IP detection and domain resolution via Google DNS.
- Loading spinner for API requests to enhance user experience.
- Responsive design with Sass, optimized for mobile and desktop.
- Error handling for invalid inputs, API failures, and unsupported IPv6 addresses.

### Technologies

- Vanilla JavaScript: For logic, API handling, and DOM manipulation.
- Sass: For modular, responsive styling compiled to CSS.
- Leaflet: For rendering the interactive map.
- Geo.ipify API: For fetching IP and location data.
- Google DNS API: For resolving domains to IP addresses.

## Demo

Try the live app at [here](https://[live link]/). Add, edit, delete, and filter tasks with smooth animations.

## Getting Started

### Installation

#### 1. Clone the repository:

git clone https://github.com/vanessacl/ip-address-tracker.git
cd ip-address-tracker

#### 2. Set up the Geo.ipify API key:

- Sign up at Geo.ipify to obtain an API key.
- Replace 'YOUR_GEO_IPIFY_API_KEY' in js/script.js with your API key.

#### 3. Compile Sass:

- Ensure Sass compiles scss/index.scss (or your Sass file) to css/index.css:

#### 4. Serve the application:

- Use a local server (e.g., VS Code Live Server) or open index.html in a browser.

## Usage

### 1. Open the app:

- Navigate to http://localhost:8080 (or the port provided by your server).
- The app loads your current IP’s details by default.

### 2. Search for an IP or domain:

- Enter an IPv4 address (e.g., 8.8.8.8) or domain (e.g., google.com) in the input field.
- Click the search button or press Enter to fetch details.
- View the IP, location, timezone, ISP, and map marker updated with the results.

### 3. Interact with the map:

- Zoom or pan the map to explore the location.
- Click the marker to see the city in a popup.

## License

This project is licensed under the MIT License.
