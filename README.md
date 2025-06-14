# Data Visualisation App

This project is a browser based collection of interactive data visualisations built with [p5.js](https://p5js.org/) and [Leaflet](https://leafletjs.com/). The application presents several charts that explore topics such as technology workforce diversity, gender pay gaps, climate indicators and energy usage.

## Features

Visualisations available via the menu include:

- **Tech Diversity: Race** – pie chart of employee diversity by race for a selected company.
- **Tech Diversity: Gender** – stacked bar chart comparing male and female employees across companies.
- **Pay gap by job: 2017** – scatter plot of gender pay gap versus proportion of women in different job types.
- **Pay gap: 1997-2017** – time series of the UK gender pay gap with interactive markers.
- **Climate Change** – animated line chart of global surface temperature anomalies.
- **Nominal CO2 Emissions: Country** – bar chart with cumulative percentage (Pareto) of emissions by country.
- **Global fossil fuel consumption: Type** – radial bar chart showing consumption by coal, oil and gas over time.
- **Energy consumed per capita: Country** – ranked bar chart with selectable year.
- **Energy consumed per capita: Country (Map view)** – interactive world map coloured by per-capita energy use.

Data for these charts is stored in the `data/` directory in CSV format.

## Usage

Start a local web server (for example with the VS Code **Live Server** extension or by running `python -m http.server`). Then open `index.html` from that server. A menu of visualisations will appear on the left. Select one to display the chart. Some charts include sliders or interactive controls.

No build step is required; all scripts and libraries (p5.js and Leaflet) are included in the repository.

## Repository layout

```
- index.html           Entry point that loads scripts and creates the canvas
- sketch.js            Initialises the gallery and handles drawing
- helper-functions.js  Utility functions for drawing axes and data processing
- data/                CSV datasets used by the visualisations
- lib/                 Bundled p5.js and Leaflet libraries
```
