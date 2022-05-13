import React, { useEffect, useState } from 'react';
import './App.css';
import { MenuItem, FormControl, Select, Card, CardContent } from "@mui/material";
import InfoBox from './components/InfoBox/InfoBox';
import Table from './components/Table/Table';
import { prettyPrintStat, sortData } from './components/util';
import LineGraph from './components/LineGraph/LineGraph';
import BarChart from './components/BarChart.js/BarChart';
// import numeral from 'numeral';

function App() {
  const [countries, setCountries] = useState([]);
  const [country, setInputCountry] = useState('worldwide');
  const [countryInfo, setCountryInfo] = useState({});
  const [tableData, setTableData] = useState([]);
  const [casesType, setCasesType] = useState('cases');
  const [countryData, setCountryData] = useState('data');
 
 
  useEffect(() => {
    fetch('https://disease.sh/v3/covid-19/all')
    .then((response) => response.json())
    .then((data) => {
      setCountryInfo(data);
      setCountryData(data);
    })
  }, [])

  useEffect(() => {
    const getCountriesData = async () => {
      await fetch("https://disease.sh/v3/covid-19/countries")
      .then((response) => response.json())
      .then((data) => {
        
      const countries = data.map((country) => ({
          name: country.country,
          value: country.countryInfo.iso2
        }));

        let sortedData = sortData(data);
        setTableData(sortedData);
        setCountries(countries);
      })
    }
    getCountriesData();
  }, []);

  const onCountryChange = async (e) => {
    const countryCode = e.target.value;

    //  console.log(`Country Code ==> ${countryCode}`);

    

    const url = countryCode === 'worldwide' ? 'https://disease.sh/v3/covid-19/all' : `https://disease.sh/v3/covid-19/countries/${countryCode}`

    await fetch(url)
    .then((response) => response.json())
    .then((data) => {
      setInputCountry(countryCode);
      setCountryInfo(data);
      setCountryData(data);
      
    })
  }


  // console.log("Country Code ===>", countryCode);
  return (
    <div className='app'>
    <div className='app__left'> 
    <div className='app__header'>
    <h1>COVID-19 TRACKER</h1>
      <FormControl className='app__dropdown'>
        <Select variant='outlined' onChange={onCountryChange}  value={country}>
         <MenuItem value={'worldwide'}>Worldwide</MenuItem>         
         {countries.map((country, i) => (
           <MenuItem key={i} value={country.value}>{country.name}</MenuItem>
         ))}
        </Select>
      </FormControl>
    </div>
    <div className='app__stats'>
    <InfoBox 
    isRed
    active={casesType === "cases"}
    onClick={(e) => setCasesType("cases")}
    title='Coronavirus Cases' cases={prettyPrintStat(countryInfo.todayCases)} grandtotal='Total Cases' total={prettyPrintStat(countryInfo.cases)}/>
    <InfoBox 
    // active={casesType === "recovered"}
    // onClick={(e) => setCasesType("recovered")}
    title='Recovered' cases={prettyPrintStat(countryInfo.todayRecovered)}
    grandtotal='Total Recovered' total={prettyPrintStat(countryInfo.recovered)}
    />
    <InfoBox 
    isRed
    active={casesType === "deaths"}
     onClick={(e) => setCasesType("deaths")}
    title='Deaths' cases={prettyPrintStat(countryInfo.todayDeaths)}
    grandtotal='Total Deaths' total={prettyPrintStat(countryInfo.deaths)}
    />
    </div>

   
    <div className='app__lineGraph'>
    <h3 className='app__graphTitle'>Worldwide new {casesType}</h3>
        <LineGraph className="app__graph" casesType={casesType}/>
      </div>
    </div>
   
    <Card className='app__right'>
      <CardContent>
      <div className='app__information'>
        <h3>Live Cases by Country</h3>
        <Table countries={tableData}/>
        <BarChart data={countryData} onChange={onCountryChange} value={country} />
        
        </div>
        
      </CardContent>
    </Card>
    </div>
  );
}

export default App;
