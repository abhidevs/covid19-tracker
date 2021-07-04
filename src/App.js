import React, { useState, useEffect } from "react";
import "./App.css";
import {
  FormControl,
  Select,
  MenuItem,
  Card,
  CardContent,
} from "@material-ui/core";
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";
import InfoBox from "./Component/InfoBox";
import Map from "./Component/Map";
import Table from "./Component/Table";
import { sortData, formatStats, formatTotal } from "./util";
import LineGraph from "./Component/LineGraph";
import "leaflet/dist/leaflet.css";

const theme = createMuiTheme({
  typography: {
    fontSize: 12,
  },
});

function App() {
  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState("worldwide");
  const [countryInfo, setCountryInfo] = useState({});
  const [tableData, setTableData] = useState([]);
  const [mapCenter, setMapCenter] = useState({ lat: 35.6448, lng: 77.216721 });
  const [mapZoom, setMapZoom] = useState(3);
  const [mapCountries, setMapCountries] = useState([]);
  const [casesType, setCasesType] = useState("cases");

  useEffect(() => {
    fetch("https://disease.sh/v3/covid-19/all")
      .then((response) => response.json())
      .then((data) => {
        setCountryInfo(data);
      });
  }, []);

  useEffect(() => {
    const getCountriesData = async () => {
      await fetch("https://disease.sh/v3/covid-19/countries")
        .then((response) => response.json())
        .then((data) => {
          const countries = data.map((country) => ({
            name: country.country,
            value: country.countryInfo.iso3,
          }));

          const sortedData = sortData(data);
          setTableData(sortedData);
          setMapCountries(data);
          setCountries(countries);
        });
    };

    getCountriesData();
  }, []);

  const onCountryChange = async (event) => {
    const countryCode = event.target.value;

    const url =
      countryCode === "worldwide"
        ? "https://disease.sh/v3/covid-19/all"
        : `https://disease.sh/v3/covid-19/countries/${countryCode}`;

    await fetch(url)
      .then((response) => response.json())
      .then((data) => {
        setCountry(countryCode);
        setCountryInfo(data);
        if (countryCode === "worldwide") {
          setMapCenter({ lat: 35.6448, lng: 77.216721 })
          setMapZoom(3)
        } else {
          setMapCenter([data.countryInfo.lat, data.countryInfo.long]);
          setMapZoom(3.5);
        }
      });
  };

  return (
    <div className="app">
      <div className="main">
        <div className="app-header">
          <h2>CovidTracker</h2>

          <FormControl className="dropdown">
            <Select
              variant="outlined"
              value={country}
              onChange={onCountryChange}
            >
              <MenuItem value="worldwide">worldwide</MenuItem>
              {countries.map((country) => (
                <MenuItem key={country.name} value={country.value}>
                  {country.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>

        <div className="app-stats">
          <ThemeProvider theme={theme}>
            <InfoBox
              active={casesType === 'cases'}
              onClick={(e) => setCasesType("cases")}
              className="infoBox-cases"
              title="New Cases"
              cases={formatStats(countryInfo.todayCases)}
              total={formatTotal(countryInfo.cases)}
            />
            <InfoBox
              active={casesType === 'recovered'}
              onClick={(e) => setCasesType("recovered")}
              className="infoBox-recovered"
              title="Recovered"
              cases={formatStats(countryInfo.todayRecovered)}
              total={formatTotal(countryInfo.recovered)}
            />
            <InfoBox
              active={casesType === 'deaths'}
              onClick={(e) => setCasesType("deaths")}
              className="infoBox-deaths"
              title="Deaths"
              cases={formatStats(countryInfo.todayDeaths)}
              total={formatTotal(countryInfo.deaths)}
            />
          </ThemeProvider>
        </div>

        <Map
          casesType={casesType}
          countries={mapCountries}
          center={mapCenter}
          zoom={mapZoom}
        />
      </div>

      <div className="sidebar">
        <Card>
          <CardContent>
            <h4>Live Cases by Country</h4>
            <Table countries={tableData} />
            <h4 className="graph-heading">Worldwide new {casesType}</h4>
            <LineGraph className="app-graph" casesType={casesType} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default App;
