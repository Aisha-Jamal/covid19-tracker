import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';




function BarChart({ data, country }) {
  const [barChartData, setBarChartData] = useState();
   //console.log(barChartData);
  

useEffect(() => {

  const fetchBarChartData = async () => {
    
    await fetch('https://disease.sh/v3/covid-19/countries')
    .then((response) => response.json())
    .then((data) => {
      
    const barChartData = data.map((country) => ({
        name: country.country,
        value: country.countryInfo.iso2
        }));
    ;
    
        setBarChartData(barChartData);
      })
    }
    fetchBarChartData();
  }, []);


  
  return (
    <div>
    
    <Bar 
      data={{
          labels: ['Cases', 'Recovered', 'Deaths'],
          datasets: [
            {
              label: 'People',
              backgroundColor: ['rgba(0, 0, 255, 0.5)', 'rgba(0, 255, 0, 0.5)', 'rgba(255, 0, 0, 0.5)'],
              data: [data.cases, data.recovered, data.deaths],
            },
          ],
        }}
        
        options={{
          legend: { display: false },
          title: { display: true, text: `Current state in ${data.country == null ? "Worldwide" : data.country}` },
          
        }}
        
      
    /></div>
  )
}

export default BarChart